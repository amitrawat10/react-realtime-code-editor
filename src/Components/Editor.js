import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import SOCKET_EVENTS from "../socketActions";

const Editor = ({ socket, roomId, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const initCodeMirror = async () => {
      editorRef.current = CodeMirror.fromTextArea(
        document.getElementById("editor-area"),
        {
          mode: {
            name: "javascript",
            json: true,
          },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (code) {
          if (origin !== "setValue")
            socket.current.emit(SOCKET_EVENTS.CODE_CHANGE, { code, roomId });
        }
      });
    };

    initCodeMirror();
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on(SOCKET_EVENTS.CODE_CHANGE, ({ code }) => {
        if (code) editorRef.current.setValue(code);
      });
    }
  }, [socket.current]);
  return <textarea id="editor-area"></textarea>;
};

export default Editor;
