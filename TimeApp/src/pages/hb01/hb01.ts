import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the Hb01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-hb01',
  template:'<canvas  #canvas></canvas>',
})
export class Hb01Page {
  @ViewChild('canvas')
  canvas: ElementRef;

  gl: WebGLRenderingContext;
  cw: number;
  ch: number;
  ratio: number;


  numLines: number = 10000;

  vertices_t: Array<number>;
  velocities_t: Array<number>;

  thetaArr_t: Array<number>;
  velThetaArr_t: Array<number>;
  velRadArr_t: Array<number>;
  freqArr_t: Array<number>;


  vertices:Float32Array;
  velocities:Float32Array;

  thetaArr:Float32Array;
  velThetaArr:Float32Array;
  velRadArr:Float32Array;
  freqArr:Float32Array;

  randomTargetXArr: Array<number>;
  randomTargetYArr: Array<number>;

  count: number = 0;
  cn: number = 0;

  drawType: number = 1;

  loadScene() {
    this.gl = this.canvas.nativeElement.getContext('experimental-webgl');
    if (!this.gl) {
      alert("There's no WebGL context available.");
      return;
    }
    //    Set the viewport to the canvas width and height
    this.cw = window.innerWidth;
    this.ch = window.innerHeight;
    this.canvas.nativeElement.width = this.cw;
    this.canvas.nativeElement.height = this.ch;
    this.gl.viewport(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);


    //    Load the vertex shader that's defined in a separate script
    //    block at the top of this page.
    //    More info about shaders: http://en.wikipedia.org/wiki/Shader_Model
    //    More info about GLSL: http://en.wikipedia.org/wiki/GLSL
    //    More info about vertex shaders: http://en.wikipedia.org/wiki/Vertex_shader

    //    Grab the script element
    var vertexShaderScript =
      " attribute vec3 vertexPosition; " +
      "  uniform mat4 modelViewMatrix; " +
      "  uniform mat4 perspectiveMatrix; " +
      " void main(void) {" +
      "   gl_Position = perspectiveMatrix * modelViewMatrix * vec4(  vertexPosition, 1.0); " +
      " }";
    let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, vertexShaderScript);
    this.gl.compileShader(vertexShader);
    if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
      alert("Couldn't compile the vertex shader");
      this.gl.deleteShader(vertexShader);
      return;
    }

    //    Load the fragment shader that's defined in a separate script
    //    More info about fragment shaders: http://en.wikipedia.org/wiki/Fragment_shader
    var fragmentShaderScript =
      // " #ifdef GL_ES " +
      // "  precision highp float; " +
      // " #endif " +
      " void main(void) {" +
      "    gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);" +
      "  }";

    var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, fragmentShaderScript);
    this.gl.compileShader(fragmentShader);
    if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
      alert("Couldn't compile the fragment shader");
      this.gl.deleteShader(fragmentShader);
      return;
    }

    //    Create a shader program.
    let program: WebGLProgram;
    program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      alert("Unable to initialise shaders");
      this.gl.deleteProgram(program);
      this.gl.deleteProgram(vertexShader);
      this.gl.deleteProgram(fragmentShader);
      return;
    }
    //    Install the program as part of the current rendering state
    this.gl.useProgram(program);
    //    Get the vertexPosition attribute from the linked shader program
    var vertexPosition = this.gl.getAttribLocation(program, "vertexPosition");
    //    Enable the vertexPosition vertex attribute array. If enabled, the array
    //    will be accessed an used for rendering when calls are made to commands like
    //    gl.drawArrays, gl.drawElements, etc.
    this.gl.enableVertexAttribArray(vertexPosition);

    //    Clear the color buffer (r, g, b, a) with the specified color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //    Clear the depth buffer. The value specified is clamped to the range [0,1].
    //    More info about depth buffers: http://en.wikipedia.org/wiki/Depth_buffer
    this.gl.clearDepth(1.0);
    //    Enable depth testing. This is a technique used for hidden surface removal.
    //    It assigns a value (z) to each pixel that represents the distance from this
    //    pixel to the viewer. When another pixel is drawn at the same location the z
    //    values are compared in order to determine which pixel should be drawn.
    //gl.enable(gl.DEPTH_TEST);

    this.gl.enable(this.gl.BLEND);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);

    //    Specify which function to use for depth buffer comparisons. It compares the
    //    value of the incoming pixel against the one stored in the depth buffer.
    //    Possible values are (from the OpenGL documentation):
    //    GL_NEVER - Never passes.
    //    GL_LESS - Passes if the incoming depth value is less than the stored depth value.
    //    GL_EQUAL - Passes if the incoming depth value is equal to the stored depth value.
    //    GL_LEQUAL - Passes if the incoming depth value is less than or equal to the stored depth value.
    //    GL_GREATER - Passes if the incoming depth value is greater than the stored depth value.
    //    GL_NOTEQUAL - Passes if the incoming depth value is not equal to the stored depth value.
    //    GL_GEQUAL - Passes if the incoming depth value is greater than or equal to the stored depth value.
    //    GL_ALWAYS - Always passes.
    //gl.depthFunc(gl.LEQUAL);

    //    Now create a shape.
    //    First create a vertex buffer in which we can store our data.
    var vertexBuffer = this.gl.createBuffer();
    //    Bind the buffer object to the ARRAY_BUFFER target.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    //    Specify the vertex positions (x, y, z)

    // ------------------

    this.setup();

    // ------------------



    //    Creates a new data store for the vertices array which is bound to the ARRAY_BUFFER.
    //    The third paramater indicates the usage pattern of the data store. Possible values are
    //    (from the OpenGL documentation):
    //    The frequency of access may be one of these:
    //    STREAM - The data store contents will be modified once and used at most a few times.
    //    STATIC - The data store contents will be modified once and used many times.
    //    DYNAMIC - The data store contents will be modified repeatedly and used many times.
    //    The nature of access may be one of these:
    //    DRAW - The data store contents are modified by the application, and used as the source for
    //           GL drawing and image specification commands.
    //    READ - The data store contents are modified by reading data from the GL, and used to return
    //           that data when queried by the application.
    //    COPY - The data store contents are modified by reading data from the GL, and used as the source
    //           for GL drawing and image specification commands.
    this.gl.bufferData(this.gl.ARRAY_BUFFER,  this.vertices, this.gl.DYNAMIC_DRAW);

    //    Clear the color buffer and the depth buffer
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    //    Define the viewing frustum parameters
    //    More info: http://en.wikipedia.org/wiki/Viewing_frustum
    //    More info: https://knol.google.com/k/view-frustum
    let fieldOfView = 30.0;
    let aspectRatio = this.canvas.nativeElement.width / this.canvas.nativeElement.height;
    let nearPlane = 1.0;
    let farPlane = 10000.0;
    let top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
    let bottom = -top;
    let right = top * aspectRatio;
    let left = -right;

    //     Create the perspective matrix. The OpenGL function that's normally used for this,
    //     glFrustum() is not included in the WebGL API. That's why we have to do it manually here.
    //     More info: http://www.cs.utk.edu/~vose/c-stuff/opengl/glFrustum.html
    let a = (right + left) / (right - left);
    let b = (top + bottom) / (top - bottom);
    let c = (farPlane + nearPlane) / (farPlane - nearPlane);
    let d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
    let x = (2 * nearPlane) / (right - left);
    let y = (2 * nearPlane) / (top - bottom);
    let perspectiveMatrix = [
      x, 0, a, 0,
      0, y, b, 0,
      0, 0, c, d,
      0, 0, -1, 0
    ];

    //     Create the modelview matrix
    //     More info about the modelview matrix: http://3dengine.org/Modelview_matrix
    //     More info about the identity matrix: http://en.wikipedia.org/wiki/Identity_matrix
    let modelViewMatrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
    //     Get the vertex position attribute location from the shader program
    let vertexPosAttribLocation = this.gl.getAttribLocation(program, "vertexPosition");
    //				colorLoc = gl.getVaryingLocation(gl.program, "vColor");
    //				alert("color loc : " + colorLoc );
    //     Specify the location and format of the vertex position attribute
    this.gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, this.gl.FLOAT, false, 0, 0);
    //gl.vertexAttribPointer(colorLoc, 4.0, gl.FLOAT, false, 0, 0);
    //     Get the location of the "modelViewMatrix" uniform variable from the
    //     shader program
    let uModelViewMatrix = this.gl.getUniformLocation(program, "modelViewMatrix");
    //     Get the location of the "perspectiveMatrix" uniform variable from the
    //     shader program
    var uPerspectiveMatrix = this.gl.getUniformLocation(program, "perspectiveMatrix");
    //     Set the values
    this.gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(perspectiveMatrix));
    this.gl.uniformMatrix4fv(uPerspectiveMatrix, false, new Float32Array(modelViewMatrix));
    //	gl.varyingVector4fv(
    //     Draw the triangles in the vertex buffer. The first parameter specifies what
    //     drawing mode to use. This can be GL_POINTS, GL_LINE_STRIP, GL_LINE_LOOP,
    //     GL_LINES, GL_TRIANGLE_STRIP, GL_TRIANGLE_FAN, GL_TRIANGLES, GL_QUAD_STRIP,
    //     GL_QUADS, and GL_POLYGON
    //gl.drawArrays( gl.LINES, 0, numLines );
    //gl.flush();

    //setInterval( drawScene, 1000 / 40 );
    this.animate();
    setTimeout(()=>{
      this.timer()}, 1500
    );

  }


  animate() {
    requestAnimationFrame(()=>{
      this.drawScene();
        this.animate();}
      );

  }


  drawScene() {
    this.draw();

    this.gl.lineWidth(1);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.DYNAMIC_DRAW);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    //gl.drawArrays( gl.LINES_STRIP, 0, numLines );
    this.gl.drawArrays(this.gl.LINES, 0, this.numLines);
    //gl.drawArrays( gl.QUAD_STRIP, 0, numLines );

    this.gl.flush();
  }


  draw() {

    switch (this.drawType) {
      case 0:
        this.draw0();
        break;
      case 1:
        this.draw1();
        break;
      case 2:
        this.draw2();
        break;
    }
  }


// ===================================
  setup() {

    this.vertices_t = [];
    this.velThetaArr_t = [];
    this.velRadArr_t = [];
    this.ratio = this.cw / this.ch;
    this.velocities_t = [];
    this.thetaArr_t = [];
    this.freqArr_t = [];
    this.randomTargetXArr = [];
    this.randomTargetYArr=[];

    // -------------------------------

    for (var ii = 0; ii < this.numLines; ii++) {
      var rad = (0.1 + .2 * Math.random());
      var theta = Math.random() * Math.PI * 2;
      var velTheta = Math.random() * Math.PI * 2 / 30;
      var freq = Math.random() * 0.12 + 0.03;
      var boldRate = Math.random() * .04 + .01;
      var randomPosX = (Math.random() * 2 - 1) * window.innerWidth / window.innerHeight;
      var randomPosY = Math.random() * 2 - 1;

      this.vertices_t.push(rad * Math.cos(theta), rad * Math.sin(theta), 1.83);
      this.vertices_t.push(rad * Math.cos(theta), rad * Math.sin(theta), 1.83);

      this.thetaArr_t.push(theta);
      this.velThetaArr_t.push(velTheta);
      this.velRadArr_t.push(rad);
      this.freqArr_t.push(freq);


      this.randomTargetXArr.push(randomPosX);
      this.randomTargetYArr.push(randomPosY);
    }


    this.vertices = new Float32Array(this.vertices_t);
    this.velocities = new Float32Array(this.velocities_t);

    this.thetaArr = new Float32Array(this.thetaArr_t);
    this.velThetaArr = new Float32Array(this.velThetaArr_t);
    this.velRadArr = new Float32Array(this.velRadArr_t);

    this.freqArr = new Float32Array(this.freqArr_t);
  }

  draw0() {

    var i, n = this.vertices.length, p, bp;
    var px, py;
    var pTheta;
    var rad;
    var num;
    var targetX, targetY;

    for (i = 0; i < this.numLines * 2; i += 2) {
      this.count += .3;
      bp = i * 3;

      this.vertices[bp] = this.vertices[bp + 3];
      this.vertices[bp + 1] = this.vertices[bp + 4];

      num = Math.floor(i / 2);
      targetX = this.randomTargetXArr[num];
      targetY = this.randomTargetYArr[num];


      px = this.vertices[bp + 3];
      px += (targetX - px) * (Math.random() * .04 + .06);
      this.vertices[bp + 3] = px;


      //py = (Math.sin(cn) + 1) * .2 * (Math.random() * .5 - .25);
      py = this.vertices[bp + 4];
      py += (targetY - py) * (Math.random() * .04 + .06);
      this.vertices[bp + 4] = py;

    }
  }

// -------------------------------
draw1() {

    var i, n = this.vertices.length, p, bp;
    var px, py;
    var pTheta;
    var rad;
    var num;
    var targetX, targetY;

    for (i = 0; i < this.numLines * 2; i += 2) {
      this.count += .3;
      bp = i * 3;

      this.vertices[bp] = this.vertices[bp + 3];
      this.vertices[bp + 1] = this.vertices[bp + 4];

      num = Math.floor(i / 2);
      pTheta = this.thetaArr[num];
      rad = this.velRadArr[num];

      pTheta = pTheta + this.velThetaArr[num];
      this.thetaArr[num] = pTheta;

      targetX = rad * Math.cos(pTheta);
      targetY = rad * Math.sin(pTheta);

      px = this.vertices[bp + 3];
      px += (targetX - px) * (Math.random() * .1 + .1);
      this.vertices[bp + 3] = px;


      //py = (Math.sin(cn) + 1) * .2 * (Math.random() * .5 - .25);
      py = this.vertices[bp + 4];
      py += (targetY - py) * (Math.random() * .1 + .1);
      this.vertices[bp + 4] = py;
    }
  }

// -------------------------------


  draw2() {
    this.cn += .1;

    var i, n = this.vertices.length, p, bp;
    var px, py;
    var pTheta;
    var rad;
    var num;

    for (i = 0; i < this.numLines * 2; i += 2) {
      this.count += .3;
      bp = i * 3;
      // copy old positions

      this.vertices[bp] = this.vertices[bp + 3];
      this.vertices[bp + 1] = this.vertices[bp + 4];

      num = Math.floor(i / 2);
      pTheta = this.thetaArr[num];

      rad = this.velRadArr[num];

      pTheta = pTheta + this.velThetaArr[num];
      this.thetaArr[num] = pTheta;

      px = this.vertices[bp + 3];
      px = rad * Math.cos(pTheta) * 0.1 + px;
      this.vertices[bp + 3] = px;


      //py = (Math.sin(cn) + 1) * .2 * (Math.random() * .5 - .25);
      py = this.vertices[bp + 4];

      py = py + rad * Math.sin(pTheta) * 0.1;
      //p *= ( Math.random() -.5);
      this.vertices[bp + 4] = py;
    }
  }

// -------------------------------



  timer() {


    this.drawType = (this.drawType + 1) % 3;

    setTimeout(()=>{
      this.timer()}, 1500
    );
  }


}
