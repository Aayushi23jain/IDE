import React from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';

export default function IDELayout({ questionPanel, codePanel, outputPanel }) {
  return (
    <div className="w-full h-full">
      <Group orientation="horizontal" id="horizontal-group">
        
        {/* Left Side: Question Panel */}
        <Panel 
          id="question-panel" 
          defaultSize={50} 
          minSize={10} 
          maxSize={90}
        >
          <div className="h-full pr-1">
            {questionPanel}
          </div>
        </Panel>

        {/* Middle Draggable Line */}
        <Separator id="separator-1" className="resize-handle" />

        {/* Right Side: Code + Output Panel */}
        <Panel 
          id="code-output-panel" 
          defaultSize={50} 
          minSize={10} 
          maxSize={90}
        >
          <div className="h-full pl-1">
            <Group orientation="vertical" id="vertical-group">
              
              {/* Top Right: Code Editor */}
              <Panel id="code-panel" defaultSize={65} minSize={15}>
                <div className="h-full pb-1">
                  {codePanel}
                </div>
              </Panel>

              {/* Vertical Draggable Line */}
              <Separator id="separator-2" className="resize-handle-vertical" />

              {/* Bottom Right: Output Console */}
              <Panel id="output-panel" defaultSize={35} minSize={15}>
                <div className="h-full pt-1">
                  {outputPanel}
                </div>
              </Panel>

            </Group>
          </div>
        </Panel>

      </Group>
    </div>
  );
}