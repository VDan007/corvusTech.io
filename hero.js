
//////////////////////////scroll functions/////////////////////////////
const servicesStart = document.getElementById('main');
const servicesLink = document.getElementById('servicesLink');
const contactStart = document.getElementById('contact');
const contactLink= document.getElementById('contactLink');
const arrow = document.getElementById('arrow');
arrow.addEventListener('click',scrollFunction1);
contactLink.addEventListener('click',scrollFunction2);
servicesLink.addEventListener('click',scrollFunction1);

function scrollFunction1(e){
    e.preventDefault();
    servicesStart.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
        inline: 'start'
    });
}
function scrollFunction2(e){
    e.preventDefault();
    contactStart.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
        inline: 'start'
    });
}

window.addEventListener('load',function(){
    console.log('works');
    window.history.replaceState({},"","corvustech.io");
})

//////////////////////////scroll functions/////////////////////////////

    const measureVindowWith = window.innerWidth;
    const hero = document.querySelector(".hero");
    let heroRect = hero.getBoundingClientRect();
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = heroRect.width;
    canvas.height = heroRect.height;
    
    class Particle{
        constructor(effect,x,y,color){
            this.effect = effect;
            this.x = Math.random() * this.effect.canvasWidth;
            this.y = 0;
            this.color = color;
            this.originX = x;
            this.originY = y;
            this.size = this.effect.gap;
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.distance = 0;
            this.friction = Math.random() * 0.6 + 0.15;
            this.ease = Math.random() * 0.1 + 0.04;




        }
        draw(){
            this.effect.context.fillStyle = this.color;
            this.effect.context.fillRect(this.x,this.y,this.size,this.size);
        }
        update(){
            if(document.documentElement.scrollTop == 0){
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
        } else{
            this.dx = this.x;
            this.dy = this.y;
        }
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;

            if(this.distance < this.effect.mouse.radius){
               this.angle = Math.atan2(this.dy,this.dx);
               this.vx += this.force * Math.cos(this.angle);
               this.vy += this.force * Math.sin(this.angle);
            }

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
            
        }
    }

    class Effect{
        constructor(context,canvasWidth,canvasHeight){
            this.context = context;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.textX = this.canvasWidth / 2;
            this.textY = this.canvasHeight /2;
            this.fontSize = 60;
            this.lineHeight = this.fontSize;
            this.maxTextWidth = this.canvasWidth * 0.8;
            this.textInput = document.getElementById('textInput');
           
            //particle text
            this.particles = [];
            this.gap = 2;
            this.mouse = {
                radius: 20000,
                x: 0,
                y:0,
            }
            hero.addEventListener('mousemove',(e) =>{
                this.mouse.x = e.x - heroRect.left;
                this.mouse.y = e.y - heroRect.top;
                hero.addEventListener('mouseleave',(e)=>{
                    this.mouse.x = 0;
                    this.mouse.y = 0;
                })
                
            });
            

            


        }
        wrapText(text){
            const gradient = this.context.createLinearGradient(0,0,this.canvasWidth,this.canvasHeight);
            gradient.addColorStop(0.3, '#28e3da');
            gradient.addColorStop(0.5, '#efea5a');
            gradient.addColorStop(0.7, '#a4036f');
            this.context.fillStyle = gradient;
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.lineWidth = 3;
            //this.context.strokeStyle = 'white';
            this.context.font = this.fontSize + 'px  Helvetica';
            
            //break multiline text
            let lineArray = [];
            let words = text.split(' ');
            let lineCounter = 0;
            let line = "";
            for (let i = 0; i < words.length; i++){
                let testline = line + words[i] + " ";
                if(this.context.measureText(testline).width > this.maxTextWidth){
                    line = words[i] + " ";
                    lineCounter++;
                } else {
                    line = testline;
                }
                lineArray[lineCounter] = line;
            }
            let textHeight = this.lineHeight * lineCounter;
            this.textY = this.canvasHeight/2 - textHeight/2;
            lineArray.forEach((el, index)=>{
                    this.context.fillText(el, this.textX,this.textY + (index * this.lineHeight));
                    this.context.strokeText(el,this.textX,this.textY + (index * this.lineHeight));
                });
                this.convertToParticles();

        }
        convertToParticles(){
            this.particles = [];
            const pixels = this.context.getImageData(0,0,this.canvasWidth,this.canvasHeight).data;
            this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
            for (let y = 0; y < this.canvasHeight; y+=this.gap){
                for (let x = 0; x < this.canvasWidth; x+=this.gap){
                    const index = (y * this.canvasWidth + x) * 4;
                    const alpha = pixels[index + 3];
                    if(alpha > 0){
                        const red = pixels[index];
                        const green = pixels[index +1];
                        const blue = pixels[index +2];
                        const color = 'rgb('+red + ','+ green + ',' + blue  + ')';
                        this.particles.push(new Particle(this,x,y,color));
                        
                    }
                }
            }
           

        }
        render(){
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            })
        }
        resize(width,height){
            this.canvasWidth = width;
            this.canvasHeight = height;
            this.textX = this.canvasWidth /2;
            this.textY = this.canvasHeight /2;
            this.maxTextWidth = this.canvasWidth * 0.8;
        }
    }

    let effect = new Effect(ctx,canvas.width,canvas.height);
    if(measureVindowWith <= 700){
        effect.wrapText("Behold CorvusTech architect of seriously awesome websites" );
    }else{
        effect.wrapText("Wellcome to CorvusTech, where the only thing we take seriously is creating seriously awesome websites." );
    }
    //effect.wrapText("Wellcome to CorvusTech, where the only thing we take seriously is creating seriously awesome websites." );
    effect.render();

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        effect.render();
        requestAnimationFrame(animate);
       
       
        
    }
    animate();

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }
      
      if (isMobileDevice()) {
        window.addEventListener('orientationchange',function(){
        
            heroRect = hero.getBoundingClientRect();
            canvas.width = heroRect.width;
            canvas.height = heroRect.height;
            effect = new Effect(ctx,canvas.width,canvas.height);
           // effect.resize(canvas.width,canvas.height);
           if(window.innerWidth <= 700){
            effect.wrapText("Behold CorvusTech architect of seriously awesome websites" );
            }else{
            effect.wrapText("Wellcome to CorvusTech, where the only thing we take seriously is creating seriously awesome websites." );
            }
            
           // effect.wrapText("Wellcome to CorvusTech, where the only thing we take seriously is creating seriously awesome websites.");
          // window.location.reload();
         
           
        })
      } else {
        
        window.addEventListener('resize',function(){
        
            heroRect = hero.getBoundingClientRect();
            canvas.width = heroRect.width;
            canvas.height = heroRect.height;
            effect = new Effect(ctx,canvas.width,canvas.height);
           // effect.resize(canvas.width,canvas.height);
           if(window.innerWidth <= 700){
            effect.wrapText("Behold CorvusTech architect of seriously awesome websites" );
            }else{
            effect.wrapText("Wellcome to CorvusTech, where the only thing we take seriously is creating seriously awesome websites." );
            }
            
           // effect.wrapText("Wellcome to CorvusTech, where the only thing we take seriously is creating seriously awesome websites.");
          // window.location.reload();
         
           
        })



      }

  //  window.addEventListener('resize',function(){
  //      
   //     heroRect = hero.getBoundingClientRect();
  //      canvas.width = heroRect.width;
  //      canvas.height = heroRect.height;
  //      effect = new Effect(ctx,canvas.width,canvas.height);
       // effect.resize(canvas.width,canvas.height);
  //     if(window.innerWidth <= 700){
  //      effect.wrapText("Behold CorvusTech architect of seriously awesome websites" );
  //      }else{
  //      effect.wrapText("Wellcome to CorvusTech, where the only thing we take seriously is creating seriously awesome websites." );
  //      }
        
       // effect.wrapText("Wellcome to CorvusTech, where the only thing we take seriously is creating seriously awesome websites.");
      // window.location.reload();
     
       
  //  })
    
    

  
    
//});