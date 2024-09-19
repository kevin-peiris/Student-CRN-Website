window.onload = () => {
    loadStudents();
};

const studentList = [];

async function loadStudents() {
    await fetch("http://localhost:8080")
        .then(res => res.json())
        .then(data => {
            studentList.length = 0;
            console.log(data);
            data.forEach(element => {
                let student = {
                    id: element.id,
                    name: element.name,
                    address: element.address,
                    age: element.age,
                    grade: element.grade,
                    image: element.image,
                    guardianName: element.guardianName,
                    guardianContact: element.guardianContact
                };
                studentList.push(student);
            });
            console.log(studentList);
        });

    loadTable(studentList);


}

function loadTable(studentList) {

    let table = document.getElementById("tbl");

    let body = `<thead style="position: sticky; top: 0; background-color: white; z-index: 1;">
                    <tr>
                        <th scope="col">Student-ID</th>
                        <th scope="col">Student Name</th>
                        <th scope="col">Student Age</th>
                        <th scope="col">Student Grade</th>

                    </tr>
                </thead>
                <tbody class="table-group-divider">`;

    studentList.forEach(student => {
        body += `
        <tr onclick="loadStudentCard(${student.id})" style="cursor: pointer;">
            <th scope="row">${student.id}</th>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.grade}</td>
        </tr>`
    });
    table.innerHTML = body;
}

async function addNewStudent() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    const name = document.getElementById("inp-name").value;
    const address = document.getElementById("inp-address").value;
    const age = parseInt(document.getElementById("inp-age").value, 10);
    const grade = parseInt(document.getElementById("inp-grade").value, 10);
    const guardianName=document.getElementById("inp-guardianName").value;
    const guardianContact=document.getElementById("inp-guardianContact").value;


    if (file && name && address && age && grade) {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "name": name,
                "address": address,
                "age": age,
                "grade": grade,
                "image":base64Image,
                "guardianName": guardianName,
                "guardianContact": guardianContact
            });


            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            await fetch("http://localhost:8080", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));

            loadStudents();
            alert('Student added successfully!');
            
            fileInput.value = '';
            document.getElementById("inp-name").value = '';
            document.getElementById("inp-address").value = '';
            document.getElementById("inp-age").value = '';
            document.getElementById("inp-grade").value = '';
            document.getElementById("inp-guardianName").value='';
            document.getElementById("inp-guardianContact").value='';
        };
        reader.readAsDataURL(file);
    } else {
        console.error('No file selected');
        alert('Input field or fiels EMPTY!');
    }

    
}
