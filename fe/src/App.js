
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useState } from 'react';


import './App.css'
import './CKEditor.css'

const editorConfiguration = {
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'fontFamily',
      'fontSize',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'link',
      'fontBackgroundColor',
      'fontColor',
      'highlight',
      'subscript',
      'superscript',
      '|',
      'alignment',
      '|',
      'bulletedList',
      'numberedList',
      'outdent',
      'indent',
      '|',
      'insertTable',
      '|',
      'imageUpload',
      'imageInsert',
      'mediaEmbed',
      '|',
      'horizontalLine',
      'blockQuote',
      'specialCharacters',
      'todoList',
      '|',
      'findAndReplace',
      'removeFormat'
    ]
  },
  language: 'vi',
  image: {
    toolbar: [
      'imageTextAlternative',
      'toggleImageCaption',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties'
    ]
  },
  mediaEmbed: {
    previewsInData: true
  }
}

function App() {

  const [html, setHtml] = useState('');

  const uploadImageToServerFromCKEditor = async (file) => {
    let image_url_cloud_uploaded = ''
    try {
        const formData = new FormData()
        formData.append('image', file)

        await fetch('http://localhost:5000/ckeditor/upload-image', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then(API => {
                console.log(API.image_url);
                image_url_cloud_uploaded = API.image_url
            })
            .catch((error) => console.log(error))

        return image_url_cloud_uploaded
    } catch (error) {
        console.error('Upload failed with error:', error)
        return image_url_cloud_uploaded
    }
}

  return (
    <div className="app">
      <div className='container'>
        <div className='editor'>
          <CKEditor
            editor={ Editor }
            config={ editorConfiguration }
            data=""
            onReady={(editor) => {
                editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                    return {
                        upload: async () => {
                          const file = await loader.file
                          const img_url = await uploadImageToServerFromCKEditor(file)
                          return {
                            default: img_url,
                          }
                        },
                    }
                }
            }}
            onChange={ ( event, editor ) => {
                const data = editor.getData(); 
                setHtml( data );
            } }
            onBlur={ ( event, editor ) => {
                console.log( 'Blur.', editor );
            } }
            onFocus={ ( event, editor ) => {
                console.log( 'Focus.', editor );
            } }
          />
        </div>

        <h4>Kết quả</h4>

        <div className='result'>
          <div style={{width: '100%'}} dangerouslySetInnerHTML={{ __html: html }} className='ck-content'></div>
        </div>
      </div>
    </div>
  );
}

export default App;


