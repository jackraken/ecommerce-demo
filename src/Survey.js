import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import {withRouter} from 'react-router-dom'
import './App.css';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'

import queryString from 'query-string';
import { Form, Container, Row, Button, Col, Modal, Card} from 'react-bootstrap';
import SurveyProductCell from './SurveyProductCell'
import ProductRow from './ProductRow'
import data from './data/metadata_all_with_detail_img_3_empty.json';
import flatData from './data/flat_products_list_zh.json';
import { shuffle } from './utils/utlis';
import { translate } from './utils/translate';

class Survey extends React.Component {

    changeFavicon(src) {
        // var link = document.createElement('link'),
        //     oldLink = document.getElementById('dynamic-favicon');
        // link.id = 'dynamic-favicon';
        // link.rel = 'shortcut icon';
        // link.href = src;
        // if (oldLink) {
        //  document.head.removeChild(oldLink);
        // }
        // document.head.appendChild(link);
        const favicon = document.getElementById('favicon');
        favicon.setAttribute("href", src);
    }

    getRandomProduct(data) {
        let obj_keys = Object.keys(data);
        let ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
        let selected_object = data[ran_key];
        for(let i=0; i<100; i++){
            if(typeof selected_object == "undefined"){
                ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
                selected_object = data[ran_key];
            }
            else if (Object.keys(selected_object).length < 1){
                ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
                selected_object = data[ran_key];
            }
            else{
                break;
            }
        }
        if (typeof selected_object == "undefined"){
            return {
                id: '',
                name: 'unknown',
                category: []
            }
        }
        if(selected_object.hasOwnProperty('name')){
            selected_object['id'] = ran_key
            selected_object['category'] = []
            return selected_object
        }
        else {
            let return_object = this.getRandomProduct(selected_object)
            return_object['category'].unshift(ran_key)
            return return_object
        }
    }
  
    constructor(props) {
        super(props);
        const { cookies } = props;
        let settings = cookies.get('settings')? cookies.get('settings') : [];
        let browsed = cookies.get('browsed')? cookies.get('browsed') : [];
        browsed = shuffle(browsed)
        console.log(browsed)

        let list1 = []
        let list2 = []
        // for(let i=0; i<3; i++){
        //     list1.push(this.getRandomProduct(data))
        // }
        list1.push(browsed[0]) 
        list1.push(browsed[1])
        list1.push(browsed[2])
        let targetProduct = flatData[this.props.targetProductId]
        let category = decodeURIComponent(targetProduct.url).split('/').slice(4,7)
        targetProduct = {
            ...targetProduct,
            category,
            id: this.props.targetProductId
        }
        list1.push(targetProduct)
        list1 = shuffle(list1)
        // for(let i=0; i<4; i++){
        //     list2.push(this.getRandomProduct(data))
        // }
        list2.push(browsed[3]) 
        list2.push(browsed[4])
        list2.push(browsed[5])
        let controlProduct = flatData[this.props.controlProductId]
        category = decodeURIComponent(controlProduct.url).split('/').slice(4,7)
        controlProduct = {
            ...controlProduct,
            category,
            id: this.props.controlProductId
        }
        list2.push(controlProduct)
        list2 = shuffle(list2)

        this.state = {
            questionId: 0,
            list1,
            list2,
            list3: targetProduct,
            list4: controlProduct,
            showDialog: false,
            answer1: [],
            answer2: [],
            answer3: -1,
            answer4: -1,
            answer5: "",
            other: "其他",
            unseen: [],
            username: cookies.get('username')? cookies.get('username') : ""
        }

        this.changeFavicon = this.changeFavicon.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.prevQuestion = this.prevQuestion.bind(this);
        this.changeAnswer = this.changeAnswer.bind(this);
        this.checkValid = this.checkValid.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
        this.finish = this.finish.bind(this);
        this.otherFactor = this.otherFactor.bind(this);
        this.logResult = this.logResult.bind(this);

        document.title = '問卷！';
        this.changeFavicon("/logo192.png");
    }

    componentWillMount() {
        this.props.handleNavbarToggle()
    }

    componentDidMount() {
        // this.props.toggleCategoryNav();
    }
  
    render (){
        return (
            <div className="vh-100 survey">
                <div className="survey-nav">
                    <img width="60" height="60" src="https://www.nthu.edu.tw//public/images/about10/cis-1-1.jpg"/>
                    <span className="mx-2">國立清華大學datalab實驗室</span>
                </div>
                <Row className={"mb--4"}>
                    {
                        (this.state.questionId > 0 && this.state.questionId < 6) &&
                        <Col xs={12} className="d-flex flex-row justify-content-center align-items-center my-2">
                            {/* <h2 className="mt-4">{translate("Survey") + " (" + (parseInt(this.state.questionId)-1)+ "/5)"}</h2> */}
                            <h2 className="mt--4">{"第" + (parseInt(this.state.questionId))+ "題，共5題"}</h2>
                        </Col>
                    }
                </Row>
                {this.state.questionId == 0 &&
                    // <Col xs={12}>
                    <div className="w-100 d-flex justify-content-center align-items-center flex-column" style={{height: "80%"}}>
                        <h2>恭喜！你已經完成了本階段的任務。</h2>
                        <p className="mt-4">
                            接下來，我們會請您回答五題簡單的問題。請憑您剛剛瀏覽網頁的印象來作答。
                        </p>
                        <button type="button" onClick={this.nextQuestion}>開始</button>
                    </div>
                    // </Col>
                }
                {(this.state.questionId > 0 && this.state.questionId < 6) &&
                    <div className="my-4 d-flex justify-content-center">
                        <span className={this.state.questionId == 1? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 2? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 3? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 4? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 5? "mx-2 black-dot": "mx-2 dot"}></span>
                    </div>
                }
                <Row style={{display: this.state.questionId == 1? "block": "none"}}>
                    <div className="d-flex flex-column align-items-center">
                        <h5>下面有四件商品的名稱與圖片，請問在剛剛瀏覽的過程中，有哪些商品是您印象中有看過的？請將看過的商品打勾。</h5>
                        <h5>(答案可能有任意數目，如果全部都沒看過，直接按下一題即可)</h5>
                    </div>
                    <Row>
                    {
                        this.state.list1.map(element => {
                            return (
                                <SurveyProductCell hideOption key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} handleClick={this.handleClick} checkbox/>
                            )
                        })
                    }
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 2? "block": "none"}}>
                    <div className="d-flex flex-column align-items-center">
                        <h5>下面有四件商品的名稱與圖片，請問在剛剛瀏覽的過程中，有哪些商品是您印象中有看過的？請將看過的商品打勾。</h5>
                        <h5>(答案可能有任意數目，如果全部都沒看過，直接按下一題即可)</h5>
                    </div>
                    <Row>
                    {
                        this.state.list2.map(element => {
                            return <SurveyProductCell hideOption key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} handleClick={this.handleClick} checkbox/>
                        })
                    }
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 3? "block": "none"}}>
                    {/* <h4>請看以下商品的圖片和名稱，如果以第一印象而言，您對它感興趣的程度？</h4> */}
                    <div className="d-flex flex-column align-items-center">
                        <h5>請看以下商品的圖片和名稱，如果只看第一印象，不論價錢的話，您對它感興趣的程度？</h5>
                        {/* <h5>(如果您在其他地方看到這款商品)</h5> */}
                    </div>
                    <Row className="my--2">
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                        <SurveyProductCell hideOption key={this.state.list3.id} product={this.state.list3} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <div key={`inline-radio`} className="mb-3">
                                <Form className="d-flex flex-column justify-content-center">
                                    {/* <div className="my-2"></div> */}
                                    <br/>
                                    <Form.Check className="my-2" inline label="非常感興趣" name="survey3" type={'radio'} id={`inline-radio-1`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="有點感興趣" name="survey3" type={'radio'} id={`inline-radio-2`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="普通" name="survey3" type={'radio'} id={`inline-radio-3`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="不太感興趣" name="survey3" type={'radio'} id={`inline-radio-4`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="非常不感興趣" name="survey3" type={'radio'} id={`inline-radio-5`} onChange={this.handleClick2} /><br/>
                                </Form>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 4? "block": "none"}}>
                    {/* <h4>請看以下商品的圖片和名稱，如果以第一印象而言，您對它感興趣的程度？</h4> */}
                    <div className="d-flex flex-column align-items-center">
                        <h5>請看以下商品的圖片和名稱，如果只看第一印象，不論價錢的話，您對它感興趣的程度？</h5>
                        {/* <h5>(如果您在其他地方看到這款商品)</h5> */}
                    </div>
                    <Row className="my--2">
                    <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                        <SurveyProductCell hideOption key={this.state.list4.id} product={this.state.list4} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                        <Col xs={12} sm={6} md={4} lg={3} >
                            <div key={`inline-radio`} className="mb-3">
                                <Form>
                                    {/* <div className="my-2"></div> */}
                                    <br/>
                                    <Form.Check className="my-2" inline label="非常感興趣" name="survey4" type={'radio'} id={`inline-radio-1`} onChange={this.handleClick2} /><br/><br/>
                                    <Form.Check inline label="有點感興趣" name="survey4" type={'radio'} id={`inline-radio-2`} onChange={this.handleClick2} /><br/><br/>
                                    <Form.Check inline label="普通" name="survey4" type={'radio'} id={`inline-radio-3`} onChange={this.handleClick2} /><br/><br/>
                                    <Form.Check inline label="不太感興趣" name="survey4" type={'radio'} id={`inline-radio-4`} onChange={this.handleClick2} /><br/><br/>
                                    <Form.Check inline label="非常不感興趣" name="survey4" type={'radio'} id={`inline-radio-5`} onChange={this.handleClick2} /><br/>
                                </Form>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 5? "block": "none"}}>
                    {/* <h4>在本次購買的過程中，您覺得影響您最後決定的主要因素是？</h4> */}
                    <div className="d-flex flex-column align-items-center">
                        <h5>在本階段實驗的過程中，您覺得在所有影響您最後選擇商品的因素中，最主要因素為何？</h5>
                        {/* <h5>(如果您在其他地方看到這款商品)</h5> */}
                    </div>
                    <Col className="my-4 d-flex justify-content-center" sm={12}>
                        <div key={`inline-radio`} className="mb-3">
                            <Form.Check inline label="外觀" type={'radio'} name="survey5" id={`inline-radio-1`} onChange={this.handleClick2} />
                            <Form.Check inline label="敘述" type={'radio'} name="survey5" id={`inline-radio-2`} onChange={this.handleClick2} />
                            <Form.Check inline label="價格" type={'radio'} name="survey5" id={`inline-radio-3`} onChange={this.handleClick2} />
                            <Form.Check onClick={this.otherFactor} inline label={this.state.other} type={'radio'} name="survey5" id={`inline-radio-4`} onChange={this.handleClick2} />
                        </div>
                    </Col>
                </Row>
                <div className="w-100 justify-content-center align-items-center flex-column" style={{height: "80%", display: this.state.questionId == 6? "flex": "none"}}>
                    <h2>感謝您的回答！接下來將進行下一階段的實驗</h2>
                    <button type="button"  size="lg" className="mx-1 my-2" style={{display: "block"}} onClick={() => {this.finish()}}>繼續</button> 
                </div>
                {
                    (this.state.questionId > 0 && this.state.questionId < 6) &&
                    <Row className="my-2 d-flex justify-content-center">
                        <button type="button" size="lg" className="mx-1" style={{display: this.state.questionId == 1? "none": "block"}} onClick={() => this.prevQuestion()}>上一題</button>
                        <button type="button"  size="lg" className="mx-1" style={{display: this.state.questionId == 5? "none": "block"}} onClick={() => this.nextQuestion()}>下一題</button>
                        <button type="button"  size="lg" className="mx-1" style={{display: this.state.questionId == 5? "block": "none"}} onClick={() => {this.nextQuestion()}}>完成</button> 
                        {/* <button type="button"  size="lg" className="mx-1" style={{display: this.state.questionId == 5? "block": "none"}} onClick={() => {this.setState({showDialog: true})}}>完成</button> */}
                    </Row>
                }
            </div>
        )
    }

    otherFactor() {
        let factor = prompt("請填寫原因：")
        this.setState({
            other: factor
        })
        console.log(factor)
    }

    changeAnswer(e) {
        console.log(e.target)
    }

    checkValid() {
        if(this.state.questionId == 1){
        }
    }

    nextQuestion() {
        console.log("nextQuestion")
        let nextQuestionId = Math.min(this.state.questionId + 1, 6)
        this.setState({
            questionId: nextQuestionId
        })
        this.logResult()
    }

    prevQuestion() {
        let nextQuestionId = Math.max(this.state.questionId - 1, 1)
        this.setState({
            questionId: nextQuestionId
        })
    }

    finish() {
        this.setState({
            showDialog: false
        })
        // alert("感謝您的回答！接下來將進行下一階段的實驗")
        this.props.nextTest()
        this.props.clearCart()
        setTimeout(()=>{
            this.props.history.push('') 
        }, 100)
    }

    logResult() {
        console.log(this.state)
    }

    handleClick(productId, selected) {
        let answer = []
        if(this.state.questionId == 1){
            answer = this.state.answer1
        }
        else if(this.state.questionId == 2){
            answer = this.state.answer2
        }

        if(!answer.includes(productId) && selected){
            answer.push(productId)
        }
        if(answer.includes(productId) && !selected){
            let index = answer.indexOf(productId)
            answer.splice(index, 1)
        }

        console.log(answer)

        if(this.state.questionId == 1){
            this.setState({answer1: answer.slice()})
        }
        else if(this.state.questionId == 2){
            this.setState({answer2: answer.slice()})
        }
    }

    handleClick2(e) {
        console.log(e.target)
        let answer = parseInt(e.target.id.slice(-1))

        if(e.target.name == "survey3"){
            this.setState({
                answer3: answer
            })
        }
        else if(e.target.name == "survey4"){
            this.setState({
                answer4: answer
            })
        }
        else if(e.target.name == "survey5"){
            this.setState({
                answer5: answer
            })
        }
    }
}

export default withRouter(withCookies(Survey));