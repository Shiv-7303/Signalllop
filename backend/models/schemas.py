import os
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class BusinessBase(BaseModel):
    business_name: str
    website: Optional[str] = None
    category: str
    target_audience: str
    project_brief: str
    goal: str
    region: str

class CompetitorBase(BaseModel):
    business_id: str
    competitor_name: str
    website: Optional[str] = None
    
class ReportResponse(BaseModel):
    id: str
    business_id: str
    report_data: Dict[str, Any]
    created_at: str

class OpportunityResponse(BaseModel):
    id: str
    business_id: str
    source_platform: str
    post_url: str
    post_content: str
    opportunity_type: str
    score: float
    analysis_data: Dict[str, Any]
    status: str
    created_at: str
