(function($){

	var LightBox = function(){
		var that = this;
		this.lightimg = document.getElementsByTagName('');
		this.lightMask = $('<div class="lightbox-mask">');
		this.lightboxPopup = $('<div class="lightbox-popup">');
		this.bodyNode = $(document.body);
		this.renderDOM()

		this.popupImg = this.lightboxPopup.find('img.lightbox-img');
		this.popupLoadingImg = this.lightboxPopup.find('img.lightbox-loading-img');
		this.nextBtn = this.lightboxPopup.find('span.lightbox-btn-next');
		this.preBtn = this.lightboxPopup.find('span.lightbox-btn-prev');
		this.caption = this.lightboxPopup.find('div.lightbox-caption')
		this.captionText = this.lightboxPopup.find('div.lightbox-caption h3');
		this.captionIndex = this.lightboxPopup.find('div.lightbox-caption p');

		this.picWidth = 0;
		this.picHeight = 0;

		this.lightMask.hide()
		this.lightboxPopup.hide()
		this.caption.hide()

		this.groupName = null;
		this.index = null;
		this.groupData = [];
		this.bodyNode.delegate('.js-lightbox, *[data-role=lightbox]', 'click', function(e){
			e.stopPropagation()

			var currentGroupName = $(this).attr('data-group');
			that.groupName = currentGroupName;
			//当前组名获取同一组数据
			that.getGroup()
			that.initPopup($(this))
		})
		this.lightMask.click(function(){
			$(this).fadeOut()
			that.lightboxPopup.fadeOut()
		})

		this.nextBtn.click(function(e){
			e.stopPropagation
			if(!$(this).hasClass('disabled')){
				that.goto('next')
			}
		})
		this.preBtn.click(function(e){
			e.stopPropagation
			if(!$(this).hasClass('disabled')){
				that.goto('pre')
			}
		})
		
	}

	LightBox.prototype={
		goto:function(dir){
			var that = this;
			if(dir === 'next'){
				this.index++
				if(this.index >= this.groupData.length-1){
					this.nextBtn.addClass('disabled')
					this.preBtn.removeClass('disabled')
				}else if(this.index != 0){
					this.preBtn.removeClass('disabled')
				}
			}else if(dir === 'pre'){
				this.index--
				if(this.index == 0){
					this.preBtn.addClass('disabled')
					this.nextBtn.removeClass('disabled')
				}else if(this.index <= this.groupData.length-1){
					this.nextBtn.removeClass('disabled')
				}
			}
			var src = this.groupData[this.index].src;
			var caption = this.groupData[this.index].caption;
			this.localImg(src)
			this.addText(caption)
			this.captionIndex.text(this.index+1 + ' / ' + this.groupData.length)
		},
		showMaskAndPopup: function(sourceSrc,currentId){
			// 显示图片和遮罩层
			var that = this;
			this.index = null;
			this.popupImg.hide()
			this.caption.hide()
			this.lightMask.fadeIn()

			var width = $(window).width(),
					height = $(window).height();


			this.lightboxPopup.css({
				width: width/2,
				height: height/2,
				marginLeft: width/4 + 10,
				top: -200
			}).animate({
				top: height/2 - 10 - this.lightboxPopup.height()/2
			});

			this.popupLoadingImg.css({
				marginTop: this.lightboxPopup.height()/2 - 16
			})

			this.lightboxPopup.fadeIn()

			this.index = this.getIndexOf(currentId)
			this.captionIndex.text(this.index+1 + ' / ' + this.groupData.length)
			
			this.localImg(sourceSrc)

			if(this.groupData.length > 1){
				if(this.index >= this.groupData.length-1){
					this.nextBtn.addClass('disabled')
					this.preBtn.removeClass('disabled')
				}else if(this.index <= 0){
					this.preBtn.addClass('disabled')
					this.nextBtn.removeClass('disabled')
				}
			}else{
				this.preBtn.addClass('disabled')
				this.nextBtn.addClass('disabled')
			}
		},

		localImg: function(sourceSrc){
			var that = this
			this.addImg(sourceSrc,function(){
				that.popupLoadingImg.fadeOut()
				that.popupImg.attr('src', sourceSrc)
				that.changeImgSize(that.picWidth, that.picHeight)
			})
		},

		getIndexOf: function(currentId){
			// 获取当前图片组里的索引
			var index = 0;
			$(this.groupData).each(function(i){
				index = i;
				if(this.id === currentId){
					return false
				}
			})

			return index
		},

		addText: function(text){
			this.captionText.text(text)
		},

		changeImgSize: function(width, height){
			// 设置图片大小
			var that = this
			var winWidth = $(window).width(),
					winHeight = $(window).height();

			var scale = Math.min(winWidth/(width+10), winHeight/(height+10))

			width = width * scale;
			height = height * scale;
			
			this.lightboxPopup.animate({
				marginLeft: winWidth/2 - width/2,
				top: winHeight/2 - height/2,
				width: width-10,
				height: height-10
			},function(){
				that.popupImg.fadeIn()
				that.caption.fadeIn()
			})

		},

		addImg: function(sourceSrc,callback){
			// 图片加载异步函数
			this.picWidth = 0;
			this.picHeight = 0;
			var img = new Image()
			img.src = null
			img.onload = function(){
				callback()
			}
			img.src = sourceSrc

			this.picWidth = img.width;
			this.picHeight = img.height;
		},

		initPopup: function(currentObj){
			// 根据点击当前的对象 获取他的信息
			var that = this,
					sourceSrc = currentObj.attr('data-source'),
					currentCaption = currentObj.attr('data-caption'),
					currentId = currentObj.attr('data-id');

			this.showMaskAndPopup(sourceSrc,currentId)
			this.addText(currentCaption)
		},

		getGroup: function(){
			var that = this;
			//当前组名获取同一组数据
			var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");

			that.groupData.length = 0;
			groupList.each(function(){
				that.groupData.push({
					src:    $(this).attr('data-source'),
					id:     $(this).attr('data-id'),
					caption:$(this).attr('data-caption'),
					group:  $(this).attr('data-group')
				})
			})
		},

		renderDOM: function(){
			var strDOM ='<span class="lightbox-btn lightbox-btn-prev"></span>'+
									'<span class="lightbox-btn lightbox-btn-next"></span>'+
									'<img class="lightbox-img" src="">'+
									'<img class="lightbox-loading-img" src="images/loading.gif">'+
									'<div class="lightbox-caption">'+
										'<h3>图片标题</h3>'+
										'<p>3/4</p>'+
									'</div>'
			this.lightboxPopup.html(strDOM);
			this.bodyNode.append(this.lightMask,this.lightboxPopup)
		}
	}

	

	window['LightBox']= LightBox;
})(jQuery)