interface Student {
    firstName: string;
    lastName: string;
    age: number;
    location: string;
  }
  
  const student1: Student = {
    firstName: "John",
    lastName: "Doe",
    age: 20,
    location: "New York",
  };
  
  const student2: Student = {
    firstName: "Jane",
    lastName: "Smith",
    age: 22,
    location: "Los Angeles",
  };
  
  const studentsList: Student[] = [student1, student2];
  
  
  const table = document.createElement("table");
  const tableHeader = table.createTHead();
  const headerRow = tableHeader.insertRow();
  const headerFirstName = document.createElement("th");
  headerFirstName.textContent = "First Name";
  const headerLocation = document.createElement("th");
  headerLocation.textContent = "Location";
  headerRow.appendChild(headerFirstName);
  headerRow.appendChild(headerLocation);
  
  const tableBody = table.createTBody();
  studentsList.forEach((student) => {
    const row = tableBody.insertRow();
    const cellFirstName = row.insertCell();
    const cellLocation = row.insertCell();
    cellFirstName.textContent = student.firstName;
    cellLocation.textContent = student.location;
  });
  
  
  document.body.appendChild(table);
  