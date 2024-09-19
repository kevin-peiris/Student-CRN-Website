window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const studentId = parseInt(urlParams.get('studentId'), 10);

    loadStudents(studentId);
}

const studentList = [];

async function loadStudents(studentId) {
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

    loadStudentCard(studentId);
    loadStudentForm(studentId);
}


function loadStudentCard(studentId) {
    let card = document.getElementById("student-card");

    const selectedStudent = studentList.find(student => student.id === studentId);

    if (selectedStudent) {
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
                        <button type="button" class="btn btn-danger w-25" onclick="deleteStudent(${selectedStudent.id})">Delete Student</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        card.innerHTML = `<p>Student not found</p>`;
    }
}

function loadStudentForm(studentId) {
    let form = document.getElementById("studentForm");

    const selectedStudent = studentList.find(student => student.id === studentId);

    if (selectedStudent) {
        form.innerHTML = `
            <div class="row">
                <div class="col">
                    <div class="mb-3">
                        <label for="fileInput" class="form-label">Upload Student Image</label>
                        <input type="file" class="form-control" id="fileInput" />
                    </div>
                    <div class="mb-3">
                        <label for="inp-name" class="form-label">Student Name</label>
                        <input type="text" class="form-control" id="inp-name" value="${selectedStudent.name}" />
                    </div>
                    <div class="mb-3">
                        <label for="inp-address" class="form-label">Student Address</label>
                        <input type="text" class="form-control" id="inp-address"
                            value="${selectedStudent.address}" />
                    </div>
                    <div class="mb-3">
                        <label for="inp-age" class="form-label">Student Age</label>
                        <input type="number" class="form-control" id="inp-age" value="${selectedStudent.age}" />
                    </div>
                    <div class="mb-3">
                        <label for="inp-grade" class="form-label">Student Grade</label>
                        <input type="number" class="form-control" id="inp-grade"
                            value="${selectedStudent.grade}" />
                    </div>
                </div>

                <div class="col">
                    <div class="mb-3">
                        <label for="inp-guardianName" class="form-label">Guardian Name</label>
                        <input type="text" class="form-control" id="inp-guardianName"
                            value="${selectedStudent.guardianName}" />
                    </div>
                    <div class="mb-3">
                        <label for="inp-guardianContact" class="form-label">Guardian Contact</label>
                        <input type="text" class="form-control" id="inp-guardianContact"
                            value="${selectedStudent.guardianContact}" />
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-primary w-50 mx-auto" onclick="editStudent(${selectedStudent.id})">
                Edit Student
            </button>

        `;
    } else {
        form.innerHTML = `<p>Student not found</p>`;
    }
}

async function editStudent(studentId) {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    const name = document.getElementById("inp-name").value;
    const address = document.getElementById("inp-address").value;
    const age = parseInt(document.getElementById("inp-age").value, 10);
    const grade = parseInt(document.getElementById("inp-grade").value, 10);
    const guardianName=document.getElementById("inp-guardianName").value;
    const guardianContact=document.getElementById("inp-guardianContact").value;



    const selectedStudent = studentList.find(student => student.id === studentId);

    if (selectedStudent) {
        selectedStudent.name = name;
        selectedStudent.address = address;
        selectedStudent.age = age;
        selectedStudent.grade = grade;
        selectedStudent.guardianName=guardianName;
        selectedStudent.guardianContact=guardianContact;

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result.split(',')[1];
                selectedStudent.image = base64Image;

                updateStudent(selectedStudent);
                alert('Student deatails edited successfully!');
            };
            reader.readAsDataURL(file);
        } else {
            updateStudent(selectedStudent);
            alert('Student deatails edited successfully!');
        }
    } else {
        console.error("Student not found in studentList");
        alert('Student deatails edited unsuccessfully!');
    }
}

async function updateStudent(student) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "id": student.id,
        "name": student.name,
        "address": student.address,
        "age": student.age,
        "grade": student.grade,
        "image": student.image,
        "guardianName": student.guardianName,
        "guardianContact": student.guardianContact
    });

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    await fetch("http://localhost:8080/update", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            window.location.href = `index.html?studentId=${encodeURIComponent(student.id)}`;
        })
        .catch(error => console.error('Error updating student:', error));
}

async function deleteStudent(studentId) {
    await fetch(`http://localhost:8080/${studentId}`, {
        method: 'DELETE'
    });
    alert("Student Deleted Successfully");
    window.location.href = "../index.html";
}
