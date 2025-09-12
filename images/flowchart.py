import plotly.graph_objects as go

# Node labels
labels = [
    "Minimal preprocessing (fMRIPrep)",  # 0
    "Additional preprocessing",          # 1
    "Denoising",                         # 2
    "Postprocessing",                    # 3
    "Seed-Based Connectivity",           # 4
    "Atlas-Based Connectivity matrix",   # 5
    "fALFF",                             # 6
    "ReHo",                              # 7
    "Dual Regression"                    # 8
]

# Node colors
node_colors = [
    "#00CC96", "#00CC97", "#19D3F3", "#AB63FA",
    "#FFA15A", "#FF6692", "#B6E880", "#FF97FF", "#FECB52"
]

# Link colors (semi-transparent)
link_colors = [
    "rgba(0,204,150,0.1)",  # Minimal preprocessing → Additional
    "rgba(0,204,150,0.1)",  # Additional → Denoising
    "rgba(25,211,243,0.1)", # Denoising → Postprocessing
    "rgba(160,160,160,0.1)", # Postprocessing → Seed-Based
    "rgba(160,160,160,0.1)", # Postprocessing → Atlas-Based
    "rgba(160,160,160,0.1)", # Postprocessing → fALFF
    "rgba(160,160,160,0.1)", # Postprocessing → ReHo
    "rgba(160,160,160,0.1)"  # Postprocessing → Dual Regression
]

fig = go.Figure(go.Sankey(
    arrangement="freeform",  # centers thin flows automatically
    node=dict(
        color=node_colors,
        pad=25,
        thickness=30,
        label=[""] * len(labels), # hide built-in labels
        line=dict(color="white", width=0.8)
    ),
    link=dict(
        source=[0, 1, 2, 3, 3, 3, 3, 3],   # indices of source nodes
        target=[1, 2, 3, 4, 5, 6, 7, 8],   # indices of target nodes
        value=[0.5, 0.5, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4], # thin bands
        color=link_colors
    )
))

fig.update_layout(
    title_text="HALFpipe Workflow",
    font=dict(size=18),
    paper_bgcolor="white",
    plot_bgcolor="white"
)

fig.show()
