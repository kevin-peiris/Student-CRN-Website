window.onload = loadStudents();

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




function loadStudentCard(studentId) {
    let card = document.getElementById("student-card");

    const selectedStudent = studentList.find(student => student.id === studentId);

    card.innerHTML = `
        <div class="card">
            <div class="card-header">
                Student
            </div>
            <div class="card-body text-center">
                <div class="row row-cols-2">
                    <div class="col">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Student-ID : ${selectedStudent.id}</li>
                            <li class="list-group-item">Student Name : ${selectedStudent.name}</li>
                            <li class="list-group-item">Student Address : ${selectedStudent.address}</li>
                            <li class="list-group-item">Student Age : ${selectedStudent.age}</li>
                            <li class="list-group-item">Student Grade : ${selectedStudent.grade}</li>
                        </ul>
                    </div>
                    <div class="col">
                        <img src="data:image/png;base64,${selectedStudent.image}" alt="Student Image" class="rounded-circle img-fluid" style="width: 200px; height: 200px; object-fit: cover;">
                        <h5 class="card-title pt-3">${selectedStudent.name}</h5>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="card mt-1">
            <div class="card-header">
                Guardian
            </div>
            <div class="card-body text-center">
                <div class="row row-cols-1">
                    <div class="col">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Guardian Name : ${selectedStudent.guardianName}</li>
                            <li class="list-group-item">Guardian ContactNum : ${selectedStudent.guardianContact}</li>
                        </ul>
                    </div>
                </div>
                <div class="row mt-3">
                    <button type="button" class="btn btn-success" onclick="editStudent(${selectedStudent.id})">Edit Student Details</button>
                </div>
            </div>
        </div>

    `;


}

function editStudent(studentId) {
    window.location.href = `Edit-Student/index.html?studentId=${encodeURIComponent(studentId)}`;
}

document.getElementById('search-button').addEventListener('click', function () {
    const search = document.getElementById('search-input').value;
    
    const searchId = parseInt(search, 10);

    const searchStudent = studentList.find(student => student.id === searchId || student.name.toLowerCase() === search.toLowerCase());

    if (search) {
        if (searchStudent) {
            alert('Student Found!');
            loadStudentCard(searchStudent.id);
            document.getElementById("search-input").value = '';
        } else {
            alert('Student Not Found!');
            document.getElementById("search-input").value = '';
        }
    } else {
        alert('Please enter a Student name or and Id.');
    }
});

document.getElementById('search-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('search-button').click();
    }
});
