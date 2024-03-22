/*
 *    Copyright [2021] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import Editor, { EditorOptions } from '../../../../src/index';
import {
  LocalStorageManager,
  Designer,
  Mindmap,
  CustomRESTPersistenceManager,
} from '@wisemapping/mindplot';
import MapInfoImpl from './MapInfoImpl';

const mapInfo = new MapInfoImpl('2', 'Develop Map Title', false);

const options: EditorOptions = {
  mode: 'edition-owner',
  locale: 'fr',
  enableKeyboardEvents: true,
  hideAppBar: true,
};

// const persistence = new LocalStorageManager('samples/{id}.wxml', false, false);
const persistence = new CustomRESTPersistenceManager({
  documentUrl: '/quentin/api/file/{id}',
});

const initialization = (designer: Designer) => {
  designer.addEvent('loadSuccess', () => {
    const elem = document.getElementById('mindmap-comp');
    if (elem) {
      elem.classList.add('ready');
    }
  });
};

const handleUpdated = (mindmap: Mindmap) => {
  const cleanItem = (item) => {
    return {
      children: item.getChildren().map((child) => cleanItem(child)),
      features: item.getFeatures().map((feature) => {
        return { type: feature.getType(), attributes: feature.getAttributes().id };
      }),
      props: item.getProperties(),
    };
  };
  console.log(
    'UPDATED',
    mindmap.getBranches().map((branche) => cleanItem(branche)),
    mindmap.getRelationships(),
  );
};

const handleAction = () => {
  // nothing to do
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Editor
    mapInfo={mapInfo}
    options={options}
    persistenceManager={persistence}
    onLoad={initialization}
    onChange={handleUpdated}
    onAction={handleAction}
  />,
);
