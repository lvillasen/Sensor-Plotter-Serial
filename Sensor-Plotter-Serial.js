let port;
let reader;
let isPortOpen = false;
var printData = 0;

let readingInterval; // Variable para almacenar el identificador del temporizador
var n_read = 0;
var sampling_rate; 
var time_update; 
var data_out = document.getElementById("display_data");
var points_max = parseInt(document.getElementById("points_max").value)+1;
const connectButton = document.getElementById ('SerialConnectBt');


data_out.style.display = "none";
var plotOut = document.getElementById("plot_dataXY");
var totalTime;
connectButton.addEventListener('click', connectToSerial );
/*
applyOrientation();

window.onresize = function(event) {
        applyOrientation();
    }

function applyOrientation() {
    
var my_element = document.getElementById("plot_data");

    my_element.scrollIntoView({
  behavior: "smooth",
  block: "start",
  inline: "nearest"
});

}
 
    
*/



var result1000 = [];
var result = [];
var data1000 = "" ; 
var data_tot = [];
var data_tot2 = [];
var myfft;
var X_axis;

var columnX;
var columnY;

var n_read = 0;


var chunk = "";
code_out1();
code_out2();
code_out3();
code_out4();
code_out5();

var toggle_code1 = document.getElementById('toggleCode1');
toggle_code1.addEventListener('click', code_out1);

var toggle_code2 = document.getElementById('toggleCode2');
toggle_code2.addEventListener('click', code_out2);
var toggle_code3 = document.getElementById('toggleCode3');
toggle_code3.addEventListener('click', code_out3);
var toggle_code4 = document.getElementById('toggleCode4');
toggle_code4.addEventListener('click', code_out4);
var toggle_code5 = document.getElementById('toggleCode5');
toggle_code5.addEventListener('click', code_out5);


var toggle_X = document.getElementById('toggleX');
toggle_X.addEventListener('click', plotX_out);
var toggle_Y = document.getElementById('toggleY');
toggle_Y.addEventListener('click', plotY_out);
var toggle_YvsX = document.getElementById('toggleXY');
toggle_YvsX.addEventListener('click', plotXY_out);

async function connectToSerial() {
    try {
        // Si el puerto ya está abierto, lo cerramos
        if (isPortOpen) {
            await closeSerialPort();
            return;
        }

        if (!port) {
            // Solicitar permiso para acceder al puerto serie
            port = await navigator.serial.requestPort();
        }
        const serial_speed = parseInt(document.getElementById("SerialSpeed").value);

        await port.open({ baudRate: [serial_speed],bufferSize: 1024  }); // Puedes cambiar la velocidad de baudios según necesites

        reader = port.readable.getReader();


        connectButton.value = 'Disconnect';
       

        isPortOpen = true;
        printData = 0;
        data_out.style.display = "none";
        plotOut.style.display = "none";


        time_update = parseFloat(document.getElementById("deltaT").value);
        //time_update = deltaT*4; // ms


        readingInterval = setInterval(readSerialData, time_update); 
    } catch (error) {
        console.error('Error:', error);
    }
}

async function closeSerialPort() {
    try {
        clearInterval(readingInterval);

        if (reader) {
            await reader.cancel();
            await reader.releaseLock();
        }

        if (port) {
            await port.close();
        }

    
        connectButton.value = 'Connect';

        isPortOpen = false;
        printData = 1;
        print_data();

    } catch (error) {
        console.error('Error:', error);
    }
}

async function readSerialData() {
     
    try {
        const { value, done } = await reader.read();
        if (!done) {
            n_read = n_read + 1;
            chunk = new TextDecoder().decode(value); 
            data1000 = data1000 + chunk;
            result1000 = data1000.split(/\r?\n/);

            columnX = parseInt(document.getElementById("ColumnX").value);
            columnY = parseInt(document.getElementById("ColumnY").value);
           
            points_max = parseInt(document.getElementById("points_max").value)+1;
            
            data_tot = [];
            data_tot2 = [];
            if (result1000.length > points_max) {
                result = result1000.slice(result1000.length-points_max,result1000.length-1);
              
                for (let i = 0;i<result.length;i++){
                    data_tot.push(String(result[i]).split(',')[columnX]);
                    data_tot2.push(String(result[i]).split(',')[columnY]);
            }

            } else {
                result = result1000;
                for (let i = 0;i<result.length-1;i++){
                    data_tot.push(String(result[i]).split(',')[columnX]);
                    data_tot2.push(String(result[i]).split(',')[columnY]);2
            }
            }


            updatePlot();
        }
    } catch (error) {
        printData = 1;
        updatePlot();
        console.error('Error:', error);
    }
}


function updatePlot(){
    X_axis = [];
    //var XX = [];
    //var YY = [];
    for (var i = 0; i < data_tot.length; i++) {
      X_axis.push(i);
    }


    var traceX = {
x: X_axis,
y: data_tot,
  mode: 'markers+lines',
  name: 'Data',
    line: {
    color: 'blue',
    width: 2,
    dash: 'line'
  }
};

    var traceY = {
x: X_axis,
y: data_tot2,
  mode: 'markers+lines',
  name: 'Delta T',
    line: {
    color: 'green',
    width: 2,
    dash: 'line'
  }
};
totalTime = data_tot2[0]*data_tot2.length/1000;
console.log("totalTime " + totalTime);
var dataX =[traceX]
    var layoutX = {
              xaxis: {
                  //   range: [0, N],
                  title: "Sample Number"
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Column " + String(columnX)
              },
              title: "Data for Column "+ String(columnX) ,font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
          };
var dataY =[traceY]
var layoutY = {
              xaxis: {
                  //   range: [0, N],
                  title: "Sample Number"
              },
              yaxis: {
                  //    range: [-1, 1],
                  title: "Column " + String(columnY)
              },
              title: "Data for Column " + String(columnY) ,font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
};
 
    

   


    Plotly.purge("plot_dataX");
    Plotly.newPlot("plot_dataX", dataX, layoutX);
    Plotly.purge("plot_dataY");
    Plotly.newPlot("plot_dataY", dataY, layoutY);

   
if (printData == 1){
    print_data();
}
}

function print_data(){



data_out.style.display = "block";

              data_out.textContent = "Row    Columns    \n";
              for (let i = 0;i<result.length ;i++){
                
                data_out.textContent += i + "," + String(result[i]) + "\n"
              }

             printData = 0;


    plotOut.style.display = "block";
    fourier();
}


async function send_deltaT() {
      try {
        const newVal = String(document.getElementById("deltaT").value);
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode('deltaT:' +newVal));
        await writer.releaseLock();
        console.log('DeltaT enviado con éxito');
        console.log(newVal);   
      } catch (error) {
        console.error('Error al enviar datos por el puerto serie:', error);
      }
}
async function send_Nrep() {
      try {
        const newVal = String(document.getElementById("Nrep").value);
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode('Nrep:' +newVal));
        await writer.releaseLock();
        console.log('Nrep enviado con éxito');
        console.log(newVal);   
      } catch (error) {
        console.error('Error al enviar datos por el puerto serie:', error);
      }
}

function plotX_out(){
var plotOut = document.getElementById("plot_dataX");
if (plotOut.style.display === "none") {
    plotOut.style.display = "block";
  } else {
    plotOut.style.display = "none";
  }
}

function plotY_out(){
var plotOut = document.getElementById("plot_dataY");
if (plotOut.style.display === "none") {
    plotOut.style.display = "block";
  } else {
    plotOut.style.display = "none";
  }
}
function plotXY_out(){
var plotOut = document.getElementById("plot_dataXY");
if (plotOut.style.display === "none") {
    plotOut.style.display = "block";
    fourier();
  } else {
    plotOut.style.display = "none";
  }

}



function code_out1(){
var codeOut = document.getElementById("code1");
if (codeOut.style.display === "none") {
    codeOut.style.display = "block";
  } else {
    codeOut.style.display = "none";
  }
}
function code_out2(){
var codeOut = document.getElementById("code2");
if (codeOut.style.display === "none") {
    codeOut.style.display = "block";
  } else {
    codeOut.style.display = "none";
  }
}
function code_out3(){
var codeOut = document.getElementById("code3");
if (codeOut.style.display === "none") {
    codeOut.style.display = "block";
  } else {
    codeOut.style.display = "none";
  }
}
function code_out4(){
var codeOut = document.getElementById("code4");
if (codeOut.style.display === "none") {
    codeOut.style.display = "block";
  } else {
    codeOut.style.display = "none";
  }
}

function code_out5(){
var codeOut = document.getElementById("code5");
if (codeOut.style.display === "none") {
    codeOut.style.display = "block";
  } else {
    codeOut.style.display = "none";
  }
}

function FFT(signal) {
    if (signal.length == 1)
        return signal;
    var halfLength = signal.length / 2;
    var even = [];
    var odd = [];
    even.length = halfLength;
    odd.length = halfLength;
    for (var i = 0; i < halfLength; ++i) {
        even[i] = signal[i * 2];
        odd[i] = signal[i * 2 + 1];
    }
    even = FFT(even);
    odd = FFT(odd);
    for (var k = 0; k < halfLength; ++k) {
        if (!(even[k] instanceof Complex))
            even[k] = new Complex(even[k], 0);
        if (!(odd[k] instanceof Complex))
            odd[k] = new Complex(odd[k], 0);
        var a = Math.cos(2 * Math.PI * k / signal.length);
        var b = Math.sin(-2 * Math.PI * k / signal.length);
        //var sigma_k = new Complex(Math.cos(2 * Math.PI * k / signal.length), Math.sin(-2 * Math.PI * k / signal.length));
        var temp_k_real = odd[k].re * a - odd[k].im * b;
        var temp_k_imag = odd[k].re * b + odd[k].im * a;
        var A_k = new Complex(even[k].re + temp_k_real, even[k].im + temp_k_imag);
        var B_k = new Complex(even[k].re - temp_k_real, even[k].im - temp_k_imag);
        signal[k] = A_k;
        signal[k + halfLength] = B_k;
    }
    return signal;
}



function Complex(re, im) {
    this.re = re;
    this.im = im || 0.0;
}

function fourier(){

var k = parseInt(document.getElementById("k").value);



var YCos = [];
var YSin = [];
var fft_re = 0;
var fft_im = 0;
var fft_abs = 0;
for (var i = 0; i < data_tot.length; i++) {

    YCos.push(Math.cos(2 * Math.PI * i / data_tot.length * k));
    YSin.push(Math.sin(2 * Math.PI * i / data_tot.length * k));
    fft_re += Math.cos(2 * Math.PI * i / data_tot.length * k) * data_tot[i];
    fft_im += -Math.sin(2 * Math.PI * i / data_tot.length * k) * data_tot[i];

    }
    fft_re = Math.round(fft_re * 100) / 100;
    fft_im = Math.round(fft_im * 100) / 100;
    fft_abs = Math.round(Math.sqrt(fft_re*fft_re + fft_im*fft_im)*100)/100;
var traceCos = {
x: X_axis,
y: YCos,
  mode: 'markers+lines',
  name: 'Re',
    line: {
    color: 'green',
    width: 2,
    dash: 'line'
  }
};
var traceSin = {
x: X_axis,
y: YSin,
  mode: 'markers+lines',
  name: 'Im',
    line: {
    color: 'red',
    width: 2,
    dash: 'line'
  }
};
frequency = Math.round(k/totalTime*100)/100;

   var dataXY =[traceCos, traceSin]
    var layoutXY = {
              xaxis: {
                //range: [-1.1, 1.1],
                title: "Column  " + String(columnX)
              },
              yaxis: {
                  //range: [-1.1, 1.1],
                  title: "Column " + String(columnY)
              },
              title: "Re = " + String(fft_re) +" ; Im = " + String(fft_im) + "<br>Abs Value = "+ String(fft_abs) + "<br>Frequency = "+ String(frequency) + " Hz",font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
  },
};
    Plotly.purge("plot_dataXY");
    Plotly.newPlot("plot_dataXY", dataXY, layoutXY);
}

function fourierFFT(){
    console.log("data_tot.length = " + data_tot.length);
    console.log("data_tot = " + data_tot);


 if (data_tot.length == points_max -1) {
var my_x = [...data_tot];
console.log("my_x = " + my_x);
 myfft = Math.fft(my_x);

 var X_real = new Array(data_tot.length / 2).fill(0);

 var X_imag = new Array(data_tot.length / 2).fill(0);

 var X_abs = new Array(data_tot.length / 2).fill(0);

 for (var i = 0; i < data_tot.length / 2; i += 1) {

     X_real[i] = myfft[i].re;
  
     X_imag[i] = myfft[i].im;
  
     X_abs[i] = Math.round(Math.sqrt(myfft[i].re * myfft[i].re + myfft[i].im * myfft[i].im)*10)/10;

 }
    console.log("FFT = " + X_abs);


}
}
function sumArray(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}