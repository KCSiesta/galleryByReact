'use strict';

require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片的信息
//let imageDatas = require('../data/imageDatas.json');
let imageDatas = require('json!../data/imageDatas.json');
//用自执行函数，将图片名信息转换为真实存在的图片的URL地址信息
imageDatas = (function getImageURL(imageDatasArr){
  for(var i=0, j = imageDatasArr.length; i < j; i++){

    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;

})(imageDatas);

/*1、创建图片组件*/
class ImgFigure extends React.Component{

  /*8、imgFigure的点击函数*/
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.isInverse();
    }else{
      this.props.isCenter();
    }
    e.stopProgation();
    e.preventDefault();
  }
  render(){

    //大管家函数将图片的每一个状态信息传递了过来
    var styleObj = {};
    //如果props属性指定了这张图片的位置信息
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }


    //如果图片的旋转角度有值并且不为0，添加rotate
    if(this.props.arrange.rotate){
      (['MozTransform','WebkitTransform','msTransform','transform']).forEach(function(value){
        styleObj[value] = 'rorate('+ this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    //将imgFigureClassName提取成一个js变量
    var imgFigureClassName = 'img-figure';
          imgFigureClassName += this.props.arrange.isInverse? ' is-Inverse':' ';
    return(
    //figure通常用来表示单个自包含的标签，即单独存在则有意义
      <figure className = {imgFigureClassName} style={styleObj} onClick = {this.handleClick.bind(this)}>
           <img src={this.props.data.imageURL}
             alt={this.props.data.title}
            />
        <figcaption>
          <h2 className = "img-title">{this.props.data.title}</h2>
          <div className = "img-back" onClick ={this.handleClick}>
             <p>
                {this.props.data.desc}
             </p>
          </div>
        </figcaption>
      </figure>
      );
  }
}

/*10、控制组件
*10.1创建控制组件的reactComponent
*10.2填充控制组件span，并添加handleClick
*10.3将控制组件添加到大管家的render中
*10.4书写控制组件的样式*/
class ControllerUnits extends React.Component{
  handleClick(e){
    //如果点击的图片是居中非翻转态，则翻转图片，否则，则居中图片
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopProgation();
  }
  render(){
    var controllerUnitsClassName = 'controll-units';
    //如果对应的是居中图片，显示控制按钮的居中态
    if(this.props.arrange.isCenter){
      controllerUnitsClassName += 'is-center';
      //如果对应的是翻转图片，显示控制按钮的反转态
      if(this.props.arrange.isInverse){
        controllerUnitsClassName += 'is-inverse';
      }
    }

    return(<span className={controllerUnitsClassName} onClick = {this.handleClick}></span>
      );
  }
}

/*获取区间内的一个随机值的函数*/
function getRangeRandom(low,high){
  return Math.ceil(Math.random() * (high-low) + low);
}
/*6、为图片添加旋转事件:
*6.1getInitialState函数中配置rotate的state信息
*6.2在大管家函数的render中，做rotate的填充
*6.3进入rearrange函数，生成一个随机的rotate值
*6.4使用rotate信息，使用者:ImgFigure*/
function get30DegRandom(){
  return ((Math.random() > 0.5 ? ' ':'-')+Math.ceil(Math.random() * 30));
}


/*大管家函数*/
class AppComponent extends React.Component{
  /*2、设置常量contant存取排布的可取值范围*/
  constructor(props){
    super(props)
    this.state = {
      imgsArrangeArr: [
/*            {
              pos:{
                top: '0',
                left: '0'
              },
              rotate: '0',
              isInverse : false.
              inCenter : false

            }*/
    ]
    },
  //2.1中心图片的位置点
  this.Constant = { //常量的key ？
  centerPos: {
    left: 0,
    right: 0
  },
  hPosRange: { //水平方向取值范围
    leftSecX: [0, 0],
    rightSecX: [0, 0],
    y: [0, 0]
  },
  vPosRange: { //垂直方向取值范围
    x: [0, 0],
    topY: [0, 0]
  }
  }
  }

 /*3、组件加载完成，为每张图片计算其位置的范围*/
componentDidMount(){

    //3.1拿到舞台的大小
      var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
   // var stageDOM = this.refs.stage,
          stageW = stageDOM.scrollWidth,
          stageH  = stageDOM.scrollHeight,
          halfStageW = Math.ceil(stageW / 2),
          halfStageH  = Math.ceil(stageH / 2);

     //3.2拿到imgFigure照片的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      //var imgFigureDom = this.refs.imgFigure0.refs.figure,
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH  = Math.ceil(imgH / 2);

    //3.3计算中心图片的位置点
    this.Constant.centerPos = {
          left : halfStageW - halfImgW,
          top:  halfStageH - halfImgH
    };

    //3.4计算左侧，右侧区域图片的排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;


    //3.5计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

 /*7、翻转函数
 **@param index 输入当前被执行inverse操作的图片对应的图片数组信息的index
***return {Function}返回一个闭包函数，其内return一个真正待执行的函数*/
  inverse(index){
            return function(){
              var imgsArrangeArr = this.state.imgsArrangeArr;
              //7.1对imgsArrangeArr[index]的图片取反
              imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
              //7.2调用大管家的state，触发渲染
              this.setState({
                imgsArrangeArr : imgsArrangeArr
              });
            }.bind(this);
            //7.3传入到imgsFigure组件中，使其可以调用该函数
  }

 /*
* 利用rearrange函数，居中对应index图片
*@param index,需要被居中的图片对应的图片信息数组中index的值
*return {Function}
*/
center(index){
  return function(){
    this.rearrange(index);
  }.bind(this);
}

 /*4、初始化函数,存储原始state*/
getInitialState(){
  return{
    //4.1数组元素--状态对象(位置信息)
    imgsArrangeArr: [
/*            {
              pos:{
                top: '0',
                left: '0'
              },
              rotate: '0',
              isInverse : false.
              inCenter : false

            }*/
    ]

      };
  }
/*5、在取值范围内排布这些图片
*@param centerIndex --指定居中排布哪一个图片*/
rearrange(centerIndex) {
    //5.1随意布局生成的随意的top和left
    var imgsArrangeArr = this.state.imgsArrangeArr,
          Constant = this.Constant,
          centerPos = Constant.centerPos,
          hPosRange = Constant.hPosRange,
          vPosRange = Constant.vPosRange,
          hPosRangeLeftSecX = hPosRange.leftSecX,
          hPosRangeRightSecX = hPosRange.rightSecX,
          hPosRangeY = hPosRange.y,
          vPosRangeTopY = vPosRange.topY,
          vPosRangeX = vPosRange.x,

    //5.2声明一个数组，用来存储部署在上侧区域的状态信息
    imgsArrangeTopArr = [],
    //5.2-2从整个图片数组中取1或0个图片部署在上侧区域
    topImgNum = Math.floor((Math.random()*2)),
    //5.2-3标记部署在上侧区域的对象是抽取取数组中的哪个位置拿出去的额
    topImgSpliceIndex = 0,

    //5.3取出centerIndex居中图片
    //利用splice函数从imgsArrangeArr数组中剔除掉位置centerIndex的图片并赋值给imgsArrangeCenterArr
    imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1)

    //5.4居中centerIndex图片,居中图片不需要旋转
    imgsArrangeCenterArr[0] ={
      pos:centerPos,
      rotate: 0,
      isCenter:true
    }

    //5.5取出要布局上侧的图片数组
    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //5.6布局上侧的图片
    imgsArrangeTopArr.forEach(function(value,index){
      imgsArrangeTopArr[index] = {
        pos:{
          top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        //上侧区域图片需要旋转,要其旋转好看，将旋转角度定为30°
        rotate:get30DegRandom(),
        isCenter:false

      };
    });

    //5.7布局左右两侧的图片
for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;
      if(i<k){
           hPosRangeLORX = hPosRangeLeftSecX;
      }else{
           hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] = {

           pos: {
               top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
               left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
           },
           rotate: get30DegRandom(),
           isCenter: false
      };
    }

    //5.8位置关系确定好了，随机数全部生成，则将它们合并
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
      //取一个元素填充上侧区域
    }
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0])

    //5.9设置state，可以触发component重新渲染
    this.setState({
        imgsArrangeArr : imgsArrangeArr
    });
  }

  /*render:渲染组件，掌控一切的数据和数据之间的切换*/
  render() {
     var controllerUnits = [ ],
            imgFigures = [ ];
     imageDatas.forEach(function(value, index) {
       //4.2初始化每一个imgsArrangeArr的状态对象
       //保证每一个状态对象能够跟imageDatas的真实索引对应起来
        if (!this.state.imgsArrangeArr[index]) {
           this.state.imgsArrangeArr[index] = {
              //如果当前没有这个索引的状态对象，则初始化它
             pos: {
             left: 0,
             top: 0
       },
             rotate: 0,
             isInverse: false,
             isCenter: false
       };
       }
        imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} />);
        controllerUnits.push(<ControllerUnits key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
     }.bind(this));

    return (
      <section className="stage" ref ="stage">
          <section className="img-sec" >
                  {imgFigures}
          </section>
          <nav className="controller-nav">
                   {controllerUnits}
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
