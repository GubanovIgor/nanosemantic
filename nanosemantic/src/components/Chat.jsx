import React, { Component, useRef } from 'react';
import style from '../stylesheets/chat.module.css';
import Message from './Message';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      clientMessage: '',
      uuid: '772c9859-4dd3-4a0d-b87d-d76b9f43cfa4',
      cuid: '',
    }
  }

  componentDidMount = async () => {
    const resp = await fetch(`https://biz.nanosemantics.ru/api/2.1/json/Chat.init`, {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(this.state.uuid),
    })
    const data = await resp.json();
    this.setState({ cuid: data });
  }

  onChange = async (e) => {
    await this.setState({ clientMessage: e.target.value });
    console.log(this.state);
  }

  submit = async () => {
    const chatRequest = {
      cuid: this.state.cuid.result.cuid,
      text: this.state.clientMessage,
    }
    const resp = await fetch(`https://biz.nanosemantics.ru/api/2.1/json/Chat.request`, {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(chatRequest),
    })
    const data = await resp.json();
    this.setState({
      history: [...this.state.history, this.state.clientMessage, data.result.text.value],
    });
    console.log(data.result.text.value)
  }

  scroll = (e) => {
    e.scrollTop = e.offsetHeight;
    console.log('hui');
  }

  scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

  render() {

    const myRef = useRef(null);
    const executeScroll = () => this.scrollToRef(myRef);

    return (
      <div>
        <div className={style.chat} onChange={this.scroll}>
          {this.state.history.map((el, index) => {
            return <Message ref={myRef} text={el} key={index} index={index}/>
          })}
        </div>
        <div className={style.messageContainer}>
          <input onChange={this.onChange} className={style.input_chat}></input>
          <button onClick={this.submit} className={style.buttonSubmit_chat}>Отправить</button>
          <button onClick={executeScroll} className={style.buttonSubmit_chat}>Прокрутить</button>
        </div>
      </div>
    )
  }
}

export default Chat;
