import './TextBox.scss';
import Box from './Box';
import global from '/core/Global';

class TextBox extends Box {
  constructor(state) {
    super({
      type: 'TextBox',
      className: 'vs-textbox',
      fontFamily: 'sans-serif',
      text: 'Text',
      color: '#FFFFFF00',
      textColor: '#000000',
      size: 14,
      bold: false,
      italic: false,
      underline: false,
      align: 'center',
      verticalAlign: 'middle',
      wordBreak: 'normal',
      ...state,
    });

    this.addNumberState('size');
  }
  
  render() {
    super.render();
    this.textNode = document.createElement('div');
    this.textNode.addEventListener('paste', function (e) {
      e.preventDefault();

      let text = '';
      if (e.clipboardData || e.originalEvent.clipboardData) {
        text = (e.originalEvent || e).clipboardData.getData('text/plain');
      } else if (window.clipboardData) {
        text = window.clipboardData.getData('Text');
      }

      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text);
      } else {
        document.execCommand('paste', false, text);
      }
    });
    this.node.appendChild(this.textNode);

    return this.node;
  }

  editable() {
    this.textNode.contentEditable = 'true';
    this.textNode.focus();
    this.textNode.addEventListener('keydown', this.keydown.bind(this));
    document.addEventListener('mousedown', this.mousedown.bind(this));
    document.execCommand('selectAll', false, null);

    // TBD: I don't want to use global state here
    global.editingObject = this;
  }

  keydown(event) {
    if (event.metaKey || event.ctrlKey) {
      switch(event.keyCode) {
        case 66: // Bold
        case 98:
        case 73: // Italic
        case 105:
        case 85: // Underline
        case 117:
          event.preventDefault();
          return false;
        case 13: // Enter
          event.preventDefault();
          this.blur();
          this.send('Controller:select', this);
          return false;
      }
    }
    return true;
  }

  mousedown(event) {
    if (event.target !== this.node && event.target !== this.textNode) {
      this.blur();
    }
  }

  blur() {
    this.textNode.contentEditable = 'false';
    this.textNode.blur();
    this.textNode.removeEventListener('keydown', this.keydown.bind(this));
    document.removeEventListener('mousedown', this.mousedown.bind(this));
    window.getSelection().removeAllRanges();

    // copy text from node
    this.text = this.textNode.innerText;
    // TBD: I don't want to use global state here
    global.editingObject = null;
  }

  on_fontFamily(font) {
    this.textNode.style.fontFamily = font;
  }

  on_size(size) {
    this.textNode.style.fontSize = size + 'px';
  }

  on_text(text) {
    this.textNode.innerText = text;
  }

  on_textColor(color) {
    this.textNode.style.color = color;
  }

  apply(style) {
    super.apply(style);

    switch(style) {
      case 'Smaller':
        if (this.size > 1) {
          this.size = parseInt(this.size) - 1;
        }
        break;
      case 'Bigger':
        this.size = parseInt(this.size) + 1;
        break;
      case 'Bold':
        this.bold = !this.bold;
        break;
      case 'Italic':
        this.italic = !this.italic;
        break;
      case 'Underline':
        this.underline = !this.underline;
        break;
      default:
        return false;
    }
    return true;
  }

  on_bold(bold) {
    if (bold) {
      this.textNode.style.fontWeight = 700;
    } else {
      this.textNode.style.fontWeight = 400;
    }
  }

  on_italic(italic) {
    if (italic) {
      this.textNode.style.fontStyle = 'italic';
    } else {
      this.textNode.style.fontStyle = 'normal';
    }
  }

  on_underline(underline) {
    if (underline) {
      this.textNode.style.textDecoration = 'underline';
    } else {
      this.textNode.style.textDecoration = 'none';
    }
  }

  on_align(align) {
    if (align == 'left') {
      this.node.style.textAlign = 'left';
      this.node.style.justifyContent = 'flex-start';
    } else if (align == 'right') {
      this.node.style.textAlign = 'right';
      this.node.style.justifyContent = 'flex-end';
    } else if (align == 'center') {
      this.node.style.textAlign = 'center';
      this.node.style.justifyContent = 'center';
    }
  }

  on_verticalAlign(align) {
    if (align == 'top') {
      this.node.style.alignItems = 'flex-start';
    } else if (align == 'bottom') {
      this.node.style.alignItems = 'flex-end';
    } else if (align == 'middle') {
      this.node.style.alignItems = 'center';
    }
  }

  on_wordBreak(value) {
    this.textNode.style.wordBreak = value;
  }
}

export default TextBox
