# 🎮 AI-Powered Game Publishing Reports

An intelligent, automated report generation system designed specifically for game publishing companies. This interactive visualization demonstrates how AI agents combine raw data sources with accumulated knowledge to generate progressively smarter business reports over time.

## 🎯 Overview

This visualization shows the complete architecture of an AI-powered report generation system using:
- **Draggable Nodes**: All components can be repositioned
- **Dynamic Arrows**: Connections automatically update when nodes move
- **Edge-to-Edge Connections**: Arrows connect precisely from node edges
- **Visual Flow Indicators**: Animated dashed lines with directional arrowheads
- **Color-Coded Connections**: Different arrow colors for different data flows

## 🎨 Design Features

### Modern UI
- Clean, professional design inspired by modern SaaS applications
- Gradient purple background (#667eea to #764ba2)
- White card container with rounded corners and shadow
- Color-coded nodes with gradients and icons

### Node Types
- **Yellow Nodes**: Data sources (Game Metrics, Billing, etc.)
- **Blue Nodes**: Data processing (Collection & Normalization)
- **Purple Nodes**: Knowledge systems (KB, AI Agent)
- **Green Nodes**: Report outputs
- **Pink Nodes**: Feedback and evolution
- **Cyan Nodes**: Human operators
- **Gray Nodes**: Infrastructure layers

### Arrow System
- **Blue Arrows**: Primary data flows
- **Purple Arrows**: Knowledge base interactions
- **Orange Arrows**: Template parameters
- **Green Arrows**: Report outputs and learning loops
- **Dashed Animation**: Shows flow direction
- **Start Circles**: Mark arrow origin points
- **Arrowheads**: Point to exact entry points

## 🚀 Features

### Interactive Components
1. **Draggable Nodes**
   - Click and drag any node to reposition
   - Arrows automatically follow and reconnect
   - Real-time edge-to-edge calculation

2. **Smart Connections**
   - Arrows connect from node edges (not centers)
   - Algorithm determines optimal exit/entry points
   - Smooth curved paths for better visibility

3. **Visual Feedback**
   - Hover effects on nodes (lift animation)
   - Animated flow on arrows
   - Clear start and end indicators

### System Architecture

**Data Flow:**
1. **7 Data Sources** → Data Collection & Normalization
2. **Data Collection** → Curated Knowledge Base
3. **Knowledge Base** → Report Template & AI Agent
4. **Report Template** → AI Agent (parameters)
5. **Data Collection** → AI Agent (real-time data)
6. **AI Agent** → Generated Report
7. **Report** → Summaries → Game Operators
8. **Report** → KB Evolution (continuous learning)

## 🎮 Use Cases

### For Game Publishing Companies
- **Zero Manual Work**: Reports generate automatically on schedule
- **Consistent Quality**: Templates ensure standardized reporting
- **AI-Enhanced Insights**: LLM agents analyze and synthesize data
- **Scalable**: One template works for thousands of games
- **Fast Decision Making**: Automated delivery to stakeholders
- **Smarter Over Time**: Knowledge accumulation improves reports

## 📊 Tabs

### Report Generation Flow
Shows the complete data-to-insight journey with:
- Data sources on the left
- Processing in the center
- Outputs and feedback on the right
- All connections clearly visualized

### Template Configuration
(Placeholder for template building interface)

## 🛠️ Technical Details

### Technologies
- Pure HTML/CSS/JavaScript (no dependencies)
- SVG for dynamic arrow rendering
- CSS gradients and animations
- Event-driven architecture

### Arrow Algorithm
```javascript
1. Calculate angle between source and target nodes
2. Determine exit edge (left/right/top/bottom)
3. Determine entry edge (opposite side)
4. Create quadratic curve path
5. Add arrowhead marker and start circle
6. Update in real-time during drag
```

### Responsive Design
- Scrollable canvas for wide diagrams
- Maintains aspect ratios
- Clean on all screen sizes

## 🎯 Key Components

### Nodes
- **Data Sources** (7): Game metrics, billing, tickets, social, news, promotion, marketing
- **Raw Data Layer**: Infrastructure note
- **Data Collection**: Normalization and storage
- **Curated KB**: Knowledge base with ontology
- **Report Template**: Configuration for specific games
- **AI Agent (LLM)**: The brain - SQL execution, action research
- **Generated Report**: Final output
- **Report Summaries**: Distilled insights
- **Game Operators**: Human decision makers
- **KB Evolution**: Continuous learning loop

### Connections (14 total)
- 7 sources → collection
- collection → KB
- KB → template
- KB → AI
- template → AI
- collection → AI
- AI → report
- report → summaries
- summaries → operators
- report → KB evolution

## 🎨 Color Palette

### Gradients
- **Yellow**: `#fef3c7 → #fde68a` (Data sources)
- **Blue**: `#dbeafe → #bfdbfe` (Processing)
- **Purple**: `#e9d5ff → #d8b4fe` (Knowledge/AI)
- **Green**: `#d1fae5 → #a7f3d0` (Output)
- **Pink**: `#fce7f3 → #fbcfe8` (Feedback)
- **Cyan**: `#cffafe → #a5f3fc` (Operators)

### Badges
- **AI Agents**: `#667eea`
- **Automated**: `#f59e0b`
- **Template-Driven**: `#10b981`

## 📝 Usage

1. Open `index.html` in a web browser
2. Explore the Report Generation Flow tab
3. Drag nodes to rearrange the diagram
4. Watch arrows automatically reconnect
5. Hover over nodes for lift effect
6. See animated flow on arrows

## 🚀 Future Enhancements

- [ ] Template Configuration tab with block builders
- [ ] Export diagram as image
- [ ] Save/load custom layouts
- [ ] Animation controls (pause/play)
- [ ] Node grouping and collapse
- [ ] Connection filtering by type
- [ ] Real-time data simulation

## 📖 Business Value

### Immediate Benefits
- Visual communication tool for stakeholders
- Training material for new team members
- Architecture documentation
- Proof of concept demonstration

### Long-term Value
- Scalable to any number of games
- Continuous improvement through KB accumulation
- Reduced manual reporting overhead
- Faster, data-driven decision making

## 🤝 Contributing

This is a visualization/demonstration tool. To extend:
1. Add new node types in the HTML
2. Define connections in the `connections` array
3. Style with CSS classes (node-*, arrow-*)
4. Arrows will automatically render

## 📄 License

Created for game publishing report automation visualization.

---

**Made with ❤️ for Game Publishing Analytics**
