import './App.css';
import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

var myEditor;

function printEditorData() {
  console.log(myEditor.getData())
}

class App extends Component {
    render() {
        return (
            <div>
              <h2>Jsramverk Texteditor</h2>
              <button onClick={printEditorData}>Spara</button>
                <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Välkommen!</p>"
                    onReady={ editor => {
                      myEditor = editor;
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    
                />
            </div>
        );
    }
}

export default App;
