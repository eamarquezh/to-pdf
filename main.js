import './style.css'
import { jsPDF } from "jspdf"

const app = document.getElementById('app')
const h1 = ()=>{return document.createElement('h1')}

const title = h1()
title.textContent='Crear PDF'


app.appendChild(title)


const datos = async () => {
    return await fetch('https://api.github.com/gists/7fb8e7d73918c944743c317eca633ec6')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const jsonFile = Object.values(data.files).find(file => file.language === 'JSON');
        if (jsonFile) {
          return fetch(jsonFile.raw_url);
        } else {
          throw new Error('El Gist no contiene un archivo JSON');
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Hubo un problema con la operación fetch:', error);
      });
  }
  
let dataObjWork = [];

datos()
.then(data => {
console.log(data[0].certificates)
    downloadResumen(data[0].work, data[0].education,data[0].certificates)
    
    //readEducation(data[0].education);
    //readCertificates(data[0].certificates);
    //readSkill(data[0].skills);
})
.catch(error => {
    console.error(error);
});




const downloadResumen=(work,education,certificates)=>{
const doc = new jsPDF();

// Agregar foto (reemplaza 'ruta/a/imagen.jpg' con la URL de tu foto)
const imgUrl = 'https://avatars.githubusercontent.com/u/10810956?v=4';
doc.addImage(imgUrl, 'JPEG', 5, 5, 25, 25);


// Agregar nombre
doc.setFont('helvetica', 'bold'); // Establecer la fuente en negrita
doc.setFontSize(16);
doc.text('Eric Alfredo Marquez', 40, 10);
doc.setFontSize(14);
doc.text('Software Engineering', 40, 15);

// Agregar información personal
doc.setFont('helvetica','normal'); // Establecer la fuente en negrita
doc.setFontSize(12);
doc.text('Phone: 52 + 771-120-87-04', 40, 25);
doc.text('E-mail: eamarquezh@gmail.com', 40, 30);
doc.text('My website: eamarquezh.xyz', 120, 25);
doc.text('Linkedin: eamarquezh', 120, 30);

doc.setLineWidth(0.5);
doc.line(5, 35, 205, 32);

let position = 45

// Agregar experiencia laboral
doc.setFont('helvetica', 'bold'); 
doc.setFontSize(14);
doc.text('Carrer path', 5, position);
doc.setFont('helvetica', 'normal'); 
doc.setFontSize(10);


work.map((a)=>{
    position +=10
    doc.text(`${a.summary} in the role of "${a.position}" \nat ${a.name} from ${a.startDate.substring(0,7)} to ${a.endDate.substring(0,7)}`, 5, position)
})

position +=20
doc.setFont('helvetica', 'bold'); 
doc.setFontSize(14);
doc.text('Educational history', 5, position);
doc.setFont('helvetica', 'normal'); 
doc.setFontSize(10);

education.map((a)=>{
    position +=10
    doc.text(`${a.area} at ${a.institution} from ${a.startDate.substring(0,7)} to ${a.endDate.substring(0,7)}`, 5, position)
})


doc.setFont('helvetica', 'normal'); 
doc.setFontSize(8);
let positionX = 5
let largeString = 0
position +=10

certificates.map((a)=>{
  console.log(positionX+'-'+(`${a.name}(${a.startDate.substring(0,7)}), `).length)
  if(positionX<140)
  {
    doc.text(`${a.name}(${a.startDate.substring(0,7)}), `, positionX, position)
    largeString = (`${a.name}(${a.startDate.substring(0,7)}), `).length
    positionX += largeString + 3
  }else{
    doc.text(`\n${a.name}(${a.startDate.substring(0,7)}), `, positionX, position)
    positionX=5
    position +=5
  }

  
})

// Guardar el documento PDF como archivo
doc.save('cv_ejemplo.pdf');
}
