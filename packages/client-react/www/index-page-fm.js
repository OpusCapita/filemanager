import React from 'react';
import ReactDOM from 'react-dom';
import { MultiUserAccessFileManager } from '@opuscapita/react-filemanager';

const fileManager = (
 <div style={{ height: '720px' }}>
    <MultiUserAccessFileManager />
  </div>
);

ReactDOM.render(fileManager, document.getElementById('main'));
