interface Student {
    firstName: string;
    lastName: string;
    age: number;
    location: string;
}

const student1: Student = {
    firstName: "Test1",
    lastName: "Test1",
    age: 18,
    location: "Test1"
};

const student2: Student = {
    firstName: "Test2",
    lastName: "Test2",
    age: 28,
    location: "Test2"
};

const studentsList: Array<Student> = [student1, student2];

function renderTable(): void {
    const table = document.createElement('table');

    const rowHeader = document.createElement('tr');

    const header1 = document.createElement('th');
    header1.textContent = "FirstName";

    const header2 = document.createElement('th');
    header2.textContent = "Location";

    rowHeader.appendChild(header1);
    rowHeader.appendChild(header2);

    table.appendChild(rowHeader);

    studentsList.forEach((student: Student) => {
        const row = document.createElement('tr');

        const cell1 = document.createElement('td');
        cell1.textContent = student.firstName;

        const cell2 = document.createElement('td');
        cell2.textContent = student.location;

        row.appendChild(cell1);
        row.appendChild(cell2);

        table.appendChild(row);
    });

  document.body.appendChild(table);
}

renderTable();
