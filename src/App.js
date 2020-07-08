import React from 'react';
import Recaptcha from 'react-recaptcha';
import logo from './logo.svg';
import './App.css';
import data from './data/metadata_all_with_detail_img_3_empty.json';
// import data from './selectedProductsFromFile.json';
import productIdToCaptchaId from './data/productIdToCaptchaId.json'
import metadata_captcha from './data/metadata_captcha.json'
import flatData from './data/flat_products_list_zh.json';
import Home from './Home'
import RCG from 'react-captcha-generator';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'
import Category from './Category'
import Checkout from './Checkout'
import Admin from './Admin'
import Survey from './Survey'
import ProductDetail from './ProductDetail'
import LoginModal from './LoginModal'
import {translate} from './utils/translate'
import {
  BrowserRouter as Router,
  withRouter,
  Route,
  Link
} from 'react-router-dom'
import { withCookies, Cookies } from 'react-cookie';
import { Col, Alert, Row, Nav, Navbar, NavDropdown, Form, FormControl, Button, SplitButton, Dropdown, Badge,
  OverlayTrigger, Popover, ListGroup, InputGroup, Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

class App extends React.Component {

  getInitState() {

  }

  constructor(props) {
    super(props);
    const { cookies } = props;
    // console.log(cookies.get('products'))

    let obj_keys = Object.keys(productIdToCaptchaId);
    // let targetProductId = obj_keys[Math.floor(Math.random() *obj_keys.length)];
    // let captchaIdList = productIdToCaptchaId[targetProductId]
    // let captchaId = captchaIdList[Math.floor(Math.random() *captchaIdList.length)];
    // console.log(ran_key)
    let testId = cookies.get('testId')? cookies.get('testId') : "3";
    let curSetting = cookies.get('username')? cookies.get('username') : "";
    let targetCategory = "Men's Fashion";
    let targetProducts = metadata_captcha[targetCategory]
    let targetProductId = "B07S11FR7F" //targetProducts[Math.floor(Math.random() *targetProducts.length)];
    let captchaType = "YouCaptcha"

    if(testId == "1"){
      targetCategory = "Men's Fashion";
      targetProductId = "B07S11FR7F"
      captchaType = "YouCaptcha"
    }
    if(testId == "2"){
      targetCategory = "Electronics";
      targetProductId = "B019U00D7K"
      captchaType = "ReCaptcha"
    }
    if(testId == "3"){
      targetCategory = "Luggage";
      targetProductId = "B00BMJSJG0"
      captchaType = "textCaptcha"
    }

    let targetProductData = flatData[targetProductId];
    let captchaIdList = productIdToCaptchaId[targetProductId]
    let captchaId = captchaIdList[Math.floor(Math.random() *captchaIdList.length)];

    this.state = {
      navbarToggle: false,
      showCategoryNav: true,
      showLogin: false,
      captchaVerified: false,
      targetCategory,
      targetProductId,
      targetProductData,
      captchaId: captchaId,
      captcha: "",
      username: cookies.get('username')? cookies.get('username') : "",
      password: "",
      usernameValid: true,
      passwordValid: true,
      userLogin: cookies.get('username')? cookies.get('username') != "" ? true: false: false,
      productsInCart: cookies.get('products')? cookies.get('products') : [],
      showProductDetail: false,
      curProduct: null,
      showSuccessDialog: false,
      captchaType
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.addProductToCart = this.addProductToCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
    this.closeDialog = this.closeDialog.bind(this)
    this.userLogin = this.userLogin.bind(this);
    this.userLogout = this.userLogout.bind(this);
    this.result = this.result.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeProductDetailDialog = this.closeProductDetailDialog.bind(this);
    this.showProduct = this.showProduct.bind(this);
    this.toggleCategoryNav = this.toggleCategoryNav.bind(this);
    this.addBrowsedProducts = this.addBrowsedProducts.bind(this);
    this.showSurvey = this.showSurvey.bind(this);
    this.nextTest = this.nextTest.bind(this);
    this.captchaSuccess = this.captchaSuccess.bind(this);
    // console.log(data)
  }

  componentDidMount() {
    if(!this.state.userLogin){
      this.setState({
        showLogin: true
      })
    }
  }

  render (){
    return (
      <Router>
      <div className=''>
        <Navbar bg="light" expand="lg" className="shadow-sm px-4" style={{display: this.state.navbarToggle? "none": "flex"}}>
          <Navbar.Brand href="/">
            <img
              alt=""
              src="shopping-cart.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            <span className="brand">KocoShop</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">

            <Nav>
              <SplitButton className={ this.state.targetCategory=="Men's Fashion"? "mr-3 target-category": "mr-3" } tag={Link} href="Men's Fashion"
                variant={this.state.targetCategory=="Men's Fashion"?'':''}
                title={translate(`Men's Fashion`)}>
                {
                  Object.keys(data["Men's Fashion"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Men's Fashion?subCategory=" + item} onClick={()=>{this.setState({selectedCategory: item})}}>
                      {translate(item)}
                    </Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton className={ this.state.targetCategory=="Women's Fashion"? "mr-3 target-category": "mr-3" } tag={Link} href="Women's Fashion"
                variant={this.state.targetCategory=="Women's Fashion"?'':''}
                title={translate(`Women's Fashion`)}>
                {
                  Object.keys(data["Women's Fashion"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Women's Fashion?subCategory=" + item}>{translate(item)}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton className={ this.state.targetCategory=="Home and Kitchen"? "mr-3 target-category": "mr-3" } tag={Link} href="Home and Kitchen"
                variant={this.state.targetCategory=="Home and Kitchen"?'':''}
                title={translate(`Home and Kitchen`)}>
                {
                  Object.keys(data["Home and Kitchen"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Home and Kitchen?subCategory=" + item}>{translate(item)}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton className={ this.state.targetCategory=="Electronics"? "mr-3 target-category": "mr-3" } tag={Link} href="Electronics"
                variant={this.state.targetCategory=="Electronics"?'':''}
                title={translate(`Electronics`)}>
                {
                  Object.keys(data["Electronics"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Electronics?subCategory=" + item}>{translate(item)}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton className={ this.state.targetCategory=="Beauty and Personal Care"? "mr-3 target-category": "mr-3" } tag={Link} href="Beauty and Personal Care"
                variant={this.state.targetCategory=="Beauty and Personal Care"?'':''}
                title={translate(`Beauty and Personal Care`)}>
                {
                  Object.keys(data["Beauty and Personal Care"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Beauty and Personal Care?subCategory=" + item}>{translate(item)}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton className={ this.state.targetCategory=="Luggage"? "mr-3 target-category": "mr-3" } tag={Link} href="Luggage"
                variant={this.state.targetCategory=="Luggage"?'':''}
                title={translate(`Luggage`)}>
                {
                  Object.keys(data["Luggage"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Luggage?subCategory=" + item}>{translate(item)}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton className={ this.state.targetCategory=="Health and Household"? "mr-3 target-category": "mr-3" } tag={Link} href="Health and Household"
                variant={this.state.targetCategory=="Health and Household"?'':''}
                title={translate(`Health and Household`)}>
                {
                  Object.keys(data["Health and Household"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Health and Household?subCategory=" + item}>{translate(item)}</Dropdown.Item>
                  ))
                }
              </SplitButton>
            </Nav>
          </Navbar.Collapse>
          <div className="d-flex flex-row align-items-center">
            <OverlayTrigger
              trigger="focus"
              key={'bottom'}
              placement={'bottom'}
              overlay={
                <Popover id={`popover-positioned-${'bottom'}`}>
                  <ListGroup>
                  {
                    this.state.productsInCart.map((product, index) => {
                        return (
                        <ListGroup.Item>
                          <Row>
                            <Col style={{cursor: "pointer"}} onClick={() => this.clearCart(index)} lg={2}><FontAwesomeIcon icon={faTimes} /></Col>
                            <Col lg={10}><strong key={product.id}>{product.name}</strong></Col>
                          </Row>
                        </ListGroup.Item>)
                      }
                    )
                  }
                  {
                    this.state.productsInCart.length > 0?
                    <>
                      <ListGroup.Item action style={{padding: 0}} onClick={() => this.clearCart()}>
                        {/* 清空購物車 */}
                        <Button size="" variant="light" className="w-100">清空購物車</Button>
                      </ListGroup.Item>
                      <ListGroup.Item style={{padding: 0}}>
                        {/* <a href="Checkout"><strong>去結帳</strong></a> */}
                        <Button href="Checkout" size="" className="w-100">去結帳</Button>
                      </ListGroup.Item>
                    </>:
                    <ListGroup.Item>
                      您的購物車目前沒有商品
                    </ListGroup.Item>
                  }
                  <ListGroup.Item>
                    <Button onClick={this.nextTest}>下一個</Button>
                  </ListGroup.Item>
                  </ListGroup>
                </Popover>
              }
            >
              <Button className="mx" variant="">
              <FontAwesomeIcon className="mx-2" icon={faShoppingCart}/>
                購物車
                <Badge className="mx-1" variant={this.state.productsInCart.length > 0? "primary" :"secondary"}>{this.state.productsInCart.length}</Badge>
              </Button>
            </OverlayTrigger>
            {
              this.state.userLogin ? 
              <>
                <span className="ml-2 mr-4" href="#home">歡迎, {this.state.username}</span>
                <Button variant="outline-primary" href="/" onClick={this.userLogout}>登出</Button>
              </>:
              <Button className="ml-2" variant="outline-primary" onClick={() => {this.setState({showLogin: true})}}>
                登入
              </Button>
            }
          </div>
        </Navbar>
        <Alert variant="success" className="shadow-sm" style={{position: "fixed", bottom: "2rem", width: "40%", left: "30%", zIndex: "1200", textAlign: "center", display: this.state.showSuccessDialog? "block" : "none"}}>
          加入購物車成功
        </Alert>
        <LoginModal showLogin={this.state.showLogin} closeDialog={this.closeDialog} 
          captchaVerified={this.state.captchaVerified} username={this.state.username}
          handleUserNameChange={this.handleUserNameChange} handlePasswordChange={this.handlePasswordChange}
          usernameValid={this.state.usernameValid} passwordValid={this.state.passwordValid}
          captchaType={this.state.captchaType} result={this.result} handleClick={this.handleClick}
          captcha={this.state.captcha} captchaId={this.state.captchaId} captchaSuccess={this.captchaSuccess}
          />
        {/* <Modal show={this.state.showLogin} onHide={this.closeDialog}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.captchaVerified? translate("Welcome") + ", " + this.state.username : translate("Login Your Account")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form >
              <div style={{display: this.state.captchaVerified? "none": "block"}}>
                <label htmlFor="basic-url">{translate("Username")}</label>                
                <InputGroup className="mb-3" style={{borderRadius:"0.25rem", border: this.state.usernameValid? "": "2px solid red"}}>
                    <FormControl 
                    placeholder={translate("Enter username...")}
                    aria-label="username"
                    aria-describedby="basic-addon"
                    onChange={this.handleUserNameChange}
                    />
                </InputGroup>
                <label htmlFor="basic-url">{translate("Password")}</label>                
                <InputGroup className="mb-3" style={{borderRadius:"0.25rem", border: this.state.passwordValid? "": "2px solid red"}}>
                    <FormControl
                    placeholder={translate("Enter password...")}
                    aria-label="password"
                    aria-describedby="basic-addon2"
                    onChange={this.handlePasswordChange}
                    />
                </InputGroup>
              </div>
              {this.state.captchaType == "textCaptcha" && <RCG
                result={this.result} // Callback function with code
              />}
              {this.state.captchaType == "textCaptcha" && <form onSubmit={this.handleClick}>
                <input type='text' className={'xxx'} ref={ref => this.captchaEnter = ref} />
                <input type='submit' />
              </form>}
              {this.state.captchaType == "YouCaptcha" && <YouCaptchaApp captchaId={this.state.captchaId} onVerify={() => {}} onSuccess={this.captchaSuccess}/>}
              {this.state.captchaType == "ReCaptcha" && <Recaptcha sitekey="6LfG6rkUAAAAAOxhm3p9iOJZ-92gHJb_UGtsTxpE" 
                render="explicit" 
                onloadCallback={()=>{console.log("onload")}} 
                verifyCallback={()=>{this.setState({captchaVerified: true})}}  />}
            </Form>
            <div className="mb-4"></div>
          </Modal.Body> */}
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={this.closeDialog}>
              Cancel
            </Button>
            <Button variant="primary" style={{display: this.state.captchaVerified? "block": "none"}} onClick={this.userLogin}>
              Login
            </Button>
          </Modal.Footer> */}
        {/* </Modal> */}
        {/* <Modal dialogClassName="modal-90w" show={this.state.showProductDetail} onHide={this.closeProductDetailDialog}>
          <Modal.Body style={{ overflowY: 'auto'}}>
            <Row>
              <ProductDetail product={this.state.curProduct} addProductToCart={this.addProductToCart}/>
            </Row>
          </Modal.Body>
        </Modal> */}
        <Route exact path="/" render={() => (
            <Home targetProductId={this.state.targetProductId} addProductToCart={this.addProductToCart} showProduct={this.showProduct} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData}/>
        )}/>
        <Route exact path="/Men's Fashion" render={(location) => (
            <Category name="Men's Fashion" data={data["Men's Fashion"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct} location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData}/>
        )}/>
        <Route exact path="/Women's Fashion" render={(location) => (
            <Category name="Women's Fashion" data={data["Women's Fashion"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData}/>
        )}/>
        <Route exact path="/Home and Kitchen" render={(location) => (
            <Category name="Home and Kitchen" data={data["Home and Kitchen"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData}/>
        )}/>
        <Route exact path="/Electronics" render={(location) => (
            <Category name="Electronics" data={data["Electronics"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData}/>
        )}/>
        <Route exact path="/Beauty and Personal Care" render={(location) => (
            <Category name="Beauty and Personal Care" data={data["Beauty and Personal Care"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData}/>
        )}/>
        <Route exact path="/Luggage" render={(location) => (
            <Category name="Luggage" data={data["Luggage"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData}/>
        )}/>
        <Route exact path="/Health and Household" render={(location) => (
            <Category name="Health and Household" data={data["Health and Household"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData}/>
        )}/>
        <Route exact path="/Checkout" render={(location) => (
            <Checkout captchaId={this.state.captchaId} toggleCategoryNav={this.toggleCategoryNav}  location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData} showSurvey={this.showSurvey}/>
        )}/>
        <Route exact path="/Product" render={(location) => (
            this.state.curProduct?
              <ProductDetail product={this.state.curProduct} addProductToCart={this.addProductToCart} showProduct={this.showProduct} location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData} targetCategory={this.state.targetCategory}/>
            :<ProductDetail product={null} addProductToCart={this.addProductToCart} showProduct={this.showProduct} location={location.location} targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData} targetCategory={this.state.targetCategory}/>
        )}/>
        <Route exact path="/Admin" render={(location) => (
            <Admin location={location.location} />
        )}/>
        <Route exact path="/Survey" render={(location) => (
            <Survey targetProductId={this.state.targetProductId} targetProductData={this.state.targetProductData} location={location.location} clearCart={this.clearCart} nextTest={this.nextTest} handleNavbarToggle={this.handleNavbarToggle}/>
        )}/>
      </div>
      </Router>
    );
  }

  handleNavbarToggle() {
    this.setState((prevState, props) => ({
        navbarToggle: !prevState.navbarToggle
    }));
  }

  addProductToCart(product) {
    console.log("add to cart:")
    console.log(product)
    const { cookies } = this.props;
    product.name = flatData[product.id].name
    this.state.productsInCart.push(product)
    cookies.set('products', JSON.stringify(this.state.productsInCart))
    this.setState({
      showSuccessDialog: true
    })
    setTimeout(() => {
      this.setState({
        showSuccessDialog: false
      })
    }, 800)
  }

  clearCart(index = null) {
    const { cookies } = this.props;
    console.log(index)
    if (index == null){
      this.setState({
        productsInCart: []
      }, ()=>{
        cookies.set('products', JSON.stringify(this.state.productsInCart))
      })
    }
    else {
      let productsInCart = cookies.get('products')? cookies.get('products') : [];
      productsInCart.splice(index, 1)
      this.setState({
        productsInCart
      }, ()=>{
        cookies.set('products', JSON.stringify(this.state.productsInCart))
      })
    }
  }

  closeDialog() {
    this.setState({
      showLogin: false,
      captchaVerified: false,
      usernameValid: true,
      passwordValid: true
    },()=>{
      if(this.state.userLogin){
        window.location.href = this.state.targetCategory;
      }
    })
  }

  showProduct(product) {
    console.log(product)
    if(!product){
      product = {
        "id": ""
      }
    }
    this.setState({
      curProduct: product,
      showProductDetail: true
    })

  }

  addBrowsedProducts() {

  }

  showSurvey() {
    this.setState({
      navbarToggle: true
    },()=>{
      window.location.href = 'Survey';
    })
  }

  nextTest() {
    const { cookies } = this.props;
    this.userLogout()
    let testId = cookies.get('testId')? cookies.get('testId') : "3";
    if(testId == "1"){
        testId = "2"
    }
    else if(testId == "2"){
        testId = "3"
    }
    else if(testId == "3"){
        testId = "1"
    }
    cookies.set('testId', testId)

    let targetCategory = "Men's Fashion";
    let targetProductId = "B07S11FR7F"
    let captchaType = "YouCaptcha"
    if(testId == "1"){
      targetCategory = "Men's Fashion";
      targetProductId = "B07S11FR7F"
      captchaType = "YouCaptcha"
    }
    if(testId == "2"){
      targetCategory = "Electronics";
      targetProductId = "B019U00D7K"
      captchaType = "ReCaptcha"
    }
    if(testId == "3"){
      targetCategory = "Luggage";
      targetProductId = "B00BMJSJG0"
      captchaType = "textCaptcha"
    }

    let targetProductData = flatData[targetProductId];
    let captchaIdList = productIdToCaptchaId[targetProductId]
    let captchaId = captchaIdList[Math.floor(Math.random() *captchaIdList.length)];

    this.setState({
      testId,
      targetCategory,
      targetProductId,
      captchaType,
      targetProductData,
      captchaId: captchaId,
      navbarToggle: false
    })
  }

  closeProductDetailDialog() {
    this.setState({
      showProductDetail: false
    })
  }

  captchaSuccess(captchaPass = false) {
    if(this.state.username == "" || this.state.password == ""){
      this.setState({
        usernameValid: this.state.username == ""? false: true,
        passwordValid: this.state.password == ""? false: true
      })
      return false
    }
    if(captchaPass){
      setTimeout(
        this.setState({
          usernameValid: true,
          passwordValid: true,
          captchaVerified: true
        }, ()=>{
          this.userLogin()
        }), 500
      )
    }
    return true
  }

  userLogin() {
    const { cookies } = this.props;
    if (this.state.username != ""){
      cookies.set('username', this.state.username)
      this.setState({
        // showLogin: false,
        userLogin: true
      })
    }
  }

  userLogout() {
    const { cookies } = this.props;
    
    cookies.set('username', "")
    this.setState({
      showLogin: false,
      userLogin: false,
      username: ""
    })
  }

  handleUserNameChange(e) {
    console.log(e);
    const text = e.target.value
    this.setState({username: text});
    // if (text) {
    //     this.setState({inputDanger: false});
    // }
  }

  handlePasswordChange(e) {
    console.log(e);
    const text = e.target.value
    this.setState({password: text});
    // if (text) {
    //     this.setState({inputDanger: false});
    // }
  }

  result(text) {
    this.setState({
      captcha: text
    })
  }

  handleClick(e) {
    e.preventDefault();
    // if(this.state.captcha === this.captchaEnter.value){
    // console.log("success")
    // this.setState({captchaVerified: true})
    // }
    this.captchaSuccess()
  }

  toggleCategoryNav() {
    this.setState({
      showCategoryNav: !this.state.showCategoryNav
    })
  }
}

export default withCookies(App)