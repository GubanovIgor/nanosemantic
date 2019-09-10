import React, { Component } from 'react';
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
      inputError: false,
    }
  }

  // Делает запрос на создание cuid для диалога
  // Выводит приветственное сообщение
  componentDidMount = async () => {
    const euid = '00b2fcbe-f27f-437b-a0d5-91072d840ed3';
    this.setState({ history: [] });
    try {
      const resp1 = await fetch(`https://biz.nanosemantics.ru/api/2.1/json/Chat.init`, {
        method: 'POST',
        header: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(this.state.uuid),
      })
      const cuid = await resp1.json();
      this.setState({ cuid: cuid.result.cuid });

      const welcome = {
        cuid: this.state.cuid,
        euid: euid,
      }
      const resp2 = await fetch(`https://biz.nanosemantics.ru/api/2.1/json/Chat.event`, {
        method: 'POST',
        header: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(welcome),
      })
      const welcomeMessage = await resp2.json();
      this.setState({
        history: [...this.state.history, welcomeMessage.result.text.value],
      });
    } catch (error) {
      alert(error);
    }
  }

  // Записывает содержимое input в локальный state
  changeInputContent = async (e) => {
    this.setState({ inputError: false });
    await this.setState({ clientMessage: e.target.value });
  }

  // Отправляет запрос с содержимым input
  // Записывает историю диалога в локальный state
  submit = async () => {
    if (!this.state.clientMessage) { // Валидация
      this.setState({ inputError: true })
    } else {
      try {
        const chatRequest = {
          cuid: this.state.cuid,
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

        let chatWindow = this.refs.chatWindow;
        chatWindow.scrollTop = 2 ** 99; // нормального решения не придумал

        // Очищает input
        await this.setState({ clientMessage: '' });
      } catch (error) {
        alert(error);
      }
    }
  }

  enterSubmit = (e) => {
    if (e.key === 'Enter') {
      this.submit();
    }
  }

  render() {
    return (
      <div>
        <div className={style.chat} ref='chatWindow'>
          {this.state.history.map((el, index) => {
            return <Message text={el} key={index} index={index} />
          })}
        </div>
        <div className={style.messageContainer}>
          {
            (!this.state.inputError) ?
              <input onChange={this.changeInputContent} className={style.input_chat} onKeyDown={this.enterSubmit} value={this.state.clientMessage} /> :
              <input onChange={this.changeInputContent} className={style.errorInput_chat} placeholder='Введите сообщение' />
          }
          <button onClick={this.submit} className={style.buttonSubmit_chat}>Отправить</button>
          <div className={style.refresh} onClick={this.componentDidMount}>
            <svg className={style.refreshImg} xmlns="http://www.w3.org/2000/svg" version="1.0" width="17px" height="17px" viewBox="0 0 1280.000000 1266.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,1266.000000) scale(0.100000,-0.100000)" className={style.refreshImgColor} fill="#000000" stroke="none">
                <path d="M6130 12653 c-1136 -47 -2253 -397 -3200 -1002 -1163 -744 -2048 -1830 -2525 -3096 -433 -1150 -520 -2406 -249 -3595 169 -740 463 -1430 880 -2063 765 -1161 1874 -2034 3189 -2509 977 -354 2044 -467 3080 -328 1388 186 2694 829 3675 1810 129 129 1201 1318 1207 1339 2 8 -1951 1746 -1964 1746 -5 0 -200 -214 -433 -475 -596 -668 -655 -732 -782 -847 -599 -539 -1284 -857 -2083 -964 -292 -39 -726 -36 -1025 7 -1069 153 -1996 719 -2605 1589 -746 1066 -863 2457 -305 3632 359 755 979 1375 1745 1744 387 186 728 287 1180 351 213 29 712 33 927 5 649 -82 1206 -288 1723 -638 269 -182 481 -372 781 -704 153 -168 162 -181 146 -196 -9 -9 -287 -254 -617 -544 -330 -291 -601 -532 -603 -537 -2 -4 4 -8 13 -8 8 0 305 -68 658 -150 353 -83 851 -200 1107 -260 256 -60 726 -170 1045 -245 319 -75 831 -195 1138 -267 307 -71 560 -128 562 -126 3 2 -47 960 -110 2129 -63 1168 -119 2221 -126 2339 -6 118 -14 245 -17 282 l-7 67 -520 -459 c-286 -252 -522 -459 -525 -459 -3 -1 -66 67 -140 150 -194 219 -425 458 -575 595 -1250 1147 -2934 1759 -4645 1687z" />
              </g>
            </svg>
          </div>
        </div>
      </div >
    )
  }
}

export default Chat;
