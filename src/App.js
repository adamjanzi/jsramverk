import './App.css';
import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

var myEditor;
var docsMap = new Map();
var createNew = true;

function fetchAllDocsPrint() {
  return fetch("http://jsramverk-editor-adja20.azurewebsites.net/doclist")
    .then((response) => response.json())
    .then((data) => printAllDocs(data));
}

function fetchAllDocs() {
  return fetch("http://jsramverk-editor-adja20.azurewebsites.net/doclist")
    .then((response) => response.json())
    .then((data) => renderDropdown(data));
}

function documentCreated(name) {
  window.alert("Document created: " + name);
}

function documentUpdated(name) {
  window.alert("Document updated: " + name);
}

function createNewDoc(docName, docContent) {
  const postData = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: docName, content: docContent })
  };
  fetch('http://jsramverk-editor-adja20.azurewebsites.net/', postData);
}

function updateDoc(docId, docName, docContent) {
  const putData = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _id: docId, name: docName, content: docContent })
  };
  fetch('http://jsramverk-editor-adja20.azurewebsites.net/', putData);
}

function onOptionClick() {
  let dropdownMenu = document.getElementById("docDropdown");
  let id = dropdownMenu.options[dropdownMenu.selectedIndex].id;
  let name = dropdownMenu.options[dropdownMenu.selectedIndex].innerHTML;
  let content = dropdownMenu.options[dropdownMenu.selectedIndex].value;
  document.getElementById("saveButton").disabled = false;
  createNew = false;
  if (id !== "startOption") {
    document.getElementById("title").value = name;
    myEditor.setData(content);
  } else {
    newDoc();
  }
}

function renderDropdown(data) {
  var mySelect = document.getElementById("docDropdown");
  var startOption = document.createElement("option");
  var startOptionText = "Choose a doc to open";
  docsMap.clear();
  removeAllOptions(document.getElementById("docDropdown"));
  startOption.id = "startOption";
  startOption.disabled = true;
  startOption.selected = true;
  startOption.value = startOptionText;
  startOption.innerHTML = startOptionText;
  mySelect.append(startOption);
  data.forEach(doc => {
    var newOption = document.createElement("option");
    docsMap.set(doc.name, [doc._id, doc.name, doc.content]);
    newOption.id = docsMap.get(doc.name)[0];
    newOption.value = docsMap.get(doc.name)[2];
    newOption.innerHTML = docsMap.get(doc.name)[1];
    mySelect.append(newOption);
  })
}

window.onload = fetchAllDocs();

function printAllDocs(data) {
  renderDropdown(data);
  myEditor.setData("");
  document.getElementById("title").value = "Showing All Documents";
  document.getElementById("saveButton").disabled = true;
  data.forEach(doc => {
    myEditor.setData(myEditor.getData() + `<h3>${doc.name}</h3>${doc.content}`);
  })
}

function removeAllOptions(selectElement) {
  var i;
  var L = selectElement.options.length - 1;
  for(i = L; i >= 0; i--) {
     selectElement.remove(i);
  }
}

function passTitle(title) {
  document.getElementById("title").value = title.target.value;
}

function saveDoc() {
  let name = document.getElementById("title").value;
  let content = myEditor.getData();
  let dropdownMenu = document.getElementById("docDropdown");
  if (createNew === true) {
    createNewDoc(name, content.slice(3, -4));
    documentCreated(name);
    newDoc();
    fetchAllDocs();
  } else {
    let _id = dropdownMenu.options[dropdownMenu.selectedIndex].id;
    let currOption = document.getElementById(_id);
    updateDoc(_id, name, content.slice(3, -4));
    documentUpdated(name);
    currOption.innerHTML = name;
    currOption.value = content;
    currOption.selected = true;
  }
}

function newDoc() {
  document.getElementById("startOption").selected = true;
  document.getElementById("saveButton").disabled = false;
  createNew = true;
  document.getElementById("title").value = "My title";
  myEditor.setData("My text");
}

class App extends Component {
    render() {
        return (
            <div>
              <h2>Jsramverk Editor</h2>
              <p><textarea id="title" name="title" defaultValue="My title" onChange={passTitle}></textarea></p>
              <button onClick={newDoc}>New</button>
              <button id="saveButton" onClick={saveDoc}>Save</button>
              <button onClick={fetchAllDocsPrint}>Print All</button>
              <select id="docDropdown" onChange={onOptionClick}></select>
                <CKEditor
                    editor={ ClassicEditor }
                    data="My text"
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
