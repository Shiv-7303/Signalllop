import os
import praw
from backend.config import Config

class RedditService:
    def __init__(self):
        try:
            self.reddit = praw.Reddit(
                client_id=Config.REDDIT_CLIENT_ID,
                client_secret=Config.REDDIT_CLIENT_SECRET,
                user_agent=Config.REDDIT_USER_AGENT
            )
        except Exception:
            self.reddit = None
            print("⚠️ Reddit API not configured. Using Virtual Fallback.")

    def search_subreddits(self, keywords, limit=10):
        """Find relevant subreddits based on keywords."""
        if not self.reddit: return []
        try:
            # PRAW search expects a string, keywords list should be joined
            query = " ".join(keywords) if isinstance(keywords, list) else keywords
            subreddits = self.reddit.subreddits.search(query, limit=limit)
            # Deduplicate by display_name
            seen = set()
            result = []
            for sub in subreddits:
                if sub.display_name not in seen:
                    result.append({
                        "name": sub.name,
                        "display_name": sub.display_name,
                        "subscribers": getattr(sub, 'subscribers', 0),
                        "description": getattr(sub, 'public_description', '')
                    })
                    seen.add(sub.display_name)
            return result
        except Exception as e:
            print(f"Reddit Search Warning: {e}")
            return []

    def search_posts(self, subreddit_names, keywords, limit_per=10, time_filter='month'):
        """Fetch top posts from specific subreddits matching keywords."""
        if not self.reddit: return []
        all_posts = []
        try:
            query = " OR ".join(keywords) if isinstance(keywords, list) else keywords
            for sub_name in subreddit_names:
                subreddit = self.reddit.subreddit(sub_name)
                posts = subreddit.search(query, limit=limit_per, time_filter=time_filter)
                for post in posts:
                    all_posts.append(self.extract_post_metadata(post))
            # Deduplicate by id
            seen_ids = set()
            unique_posts = []
            for p in all_posts:
                if p['id'] not in seen_ids:
                    unique_posts.append(p)
                    seen_ids.add(p['id'])
            return unique_posts
        except Exception as e:
            print(f"Reddit Post Search Warning: {e}")
            return []

    def get_hot_posts(self, subreddit_name, limit=25):
        """Fetches current hot posts from a subreddit."""
        try:
            subreddit = self.reddit.subreddit(subreddit_name)
            posts = subreddit.hot(limit=limit)
            return [self.extract_post_metadata(post) for post in posts]
        except Exception as e:
            print(f"Reddit Hot Posts Error: {e}")
            return []

    def get_post_comments(self, post_id, limit=10):
        """Fetch top comments for a post."""
        try:
            submission = self.reddit.submission(id=post_id)
            submission.comment_sort = 'top'
            submission.comments.replace_more(limit=0)
            comments = []
            for comment in submission.comments[:limit]:
                # Checklist 3.8: ignore deleted/removed
                if comment.body not in ["[deleted]", "[removed]"]:
                    comments.append(comment.body)
            return comments
        except Exception as e:
            print(f"Reddit Comment Error: {e}")
            return []

    def extract_post_metadata(self, post):
        """Extracts clean metadata from a PRAW submission object."""
        return {
            "id": post.id,
            "title": post.title,
            "url": post.url,
            "permalink": f"https://reddit.com{post.permalink}",
            "score": post.score,
            "comment_count": post.num_comments,
            "created_utc": post.created_utc,
            "subreddit": post.subreddit.display_name,
            "selftext": post.selftext[:1000] # Limit text for AI processing
        }

    def calculate_engagement_score(self, post_data):
        """Calculates a custom engagement score 0-100."""
        score = post_data.get('score', 0)
        comments = post_data.get('comment_count', 0)
        # Checklist formula: min(100, int((post["score"] * 0.4) + (post["num_comments"] * 2.5)))
        raw_score = (score * 0.4) + (comments * 2.5)
        return min(100, int(raw_score))

    def get_trending_keywords(self, sub_name, limit=5):
        """Detects rising keywords in a subreddit."""
        try:
            posts = self.get_hot_posts(sub_name, limit=25)
            titles = [post['title'] for post in posts]
            words = " ".join(titles).lower().split()
            from collections import Counter
            common = Counter(words).most_common(limit)
            return [word for word, count in common if len(word) > 4]
        except Exception as e:
            print(f"Trending Keywords Error: {e}")
            return []
