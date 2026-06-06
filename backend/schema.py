from pydantic import BaseModel, Field
from typing import List


class ComponentMap(BaseModel):
    file_name: str = Field(
        description="The name of the file or module analyzed.")
    purpose: str = Field(
        description="1-sentence explanation of what this file actually does.")
    dependencies: List[str] = Field(
        description="List of external libraries or internal modules this file relies on.")


class ArchitecturalTradeoff(BaseModel):
    decision: str = Field(description="A technical decision made in the code.")
    pros: List[str] = Field(
        description="Why this choice made sense for the project constraints.")
    cons: List[str] = Field(
        description="The limitations or technical debt introduced by this choice.")


class ProofOfWorkResponse(BaseModel):
    project_name: str = Field(
        description="A clean, professional title generated for the project.")
    one_liner: str = Field(
        description="A punchy, high-impact description of the project.")
    system_architecture_markdown: str = Field(
        description="A complete, production-grade README section detailing the Input -> Processing -> Output workflow in markdown format."
    )
    mermaid_diagram_code: str = Field(
        description="A valid Mermaid.js flowchart string (graph TD...) visualization representing how data moves through the files. DO NOT wrap in markdown code blocks, just return the raw string."
    )
    component_breakdown: List[ComponentMap] = Field(
        description="Mapping of how the files integrate together.")
    key_tradeoffs: List[ArchitecturalTradeoff] = Field(
        description="The critical system design trade-offs identified in the code.")
    interview_talking_points: List[str] = Field(
        description="3 highly strategic talking points the developer can use during a technical interview."
    )
