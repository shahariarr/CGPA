let semesterCount = 1;
let cgpa = 0;

function addSubject(semesterId) {
  const subjectList = document.querySelector(`#semester-${semesterId} .subject-list`);
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" placeholder="Subject Name"></td>
    <td>
      <select class="grade">
        <option value="4.00">A+</option>
        <option value="3.75">A</option>
        <option value="3.50">A-</option>
        <option value="3.25">B+</</option>
        <option value="3.00">B</option>
        <option value="2.75">B-</option>
        <option value="2.50">C+</</option>
        <option value="2.25">C</option>
        <option value="2.00">D</option>
        <option value="0.00">F</option>
      </select>
    </td>
    <td><input type="number" class="credits" min="0" step="0.5"></td>
    <td><button class="btn btn-outline-danger" onclick="removeRow(this)">Remove</button></td>
  `;
  subjectList.appendChild(row);
}

function removeRow(button) {
  const row = button.parentElement.parentElement;
  row.remove();
  calculateCGPA();
}

function addSemester() {
  semesterCount++;
  const calculator = document.getElementById('calculator');
  const newSemester = document.createElement('div');
  newSemester.className = 'semester';
  newSemester.id = `semester-${semesterCount}`;
  newSemester.innerHTML = `
    <div class="semester-header">
      <h2>Semester ${semesterCount}</h2>
      <button class="btn btn-outline-danger" onclick="removeSemester(${semesterCount})">Remove Semester</button>
      <button class="btn btn-outline-success" onclick="previewSemester(${semesterCount})">Preview</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Subject Name</th>
          <th>Grade</th>
          <th>Credits</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody class="subject-list"></tbody>
    </table>
    <button class="btn btn-outline-success" onclick="addSubject(${semesterCount})">Add Subject</button>
    <p>Semester ${semesterCount} GPA: <span id="gpa-${semesterCount}">0.00</span></p>
  `;
  calculator.insertBefore(newSemester, document.querySelector('.add-semester-btn'));
}

function removeSemester(semesterId) {
  const semester = document.getElementById(`semester-${semesterId}`);
  semester.remove();
  calculateCGPA();
}

function calculateCGPA() {
  let totalPoints = 0;
  let totalCredits = 0;

  for (let i = 1; i <= semesterCount; i++) {
    const semester = document.querySelector(`#semester-${i}`);
    if (!semester) continue;

    const rows = semester.querySelectorAll('.subject-list tr');
    let semesterPoints = 0;
    let semesterCredits = 0;

    rows.forEach((row) => {
      const grade = parseFloat(row.querySelector('.grade').value);
      const credits = parseFloat(row.querySelector('.credits').value);

      if (!isNaN(grade) && !isNaN(credits)) {
        semesterPoints += grade * credits;
        semesterCredits += credits;
      }
    });

    const semesterGPA = semesterCredits ? (semesterPoints / semesterCredits).toFixed(2) : '0.00';
    document.getElementById(`gpa-${i}`).textContent = semesterGPA;

    totalPoints += semesterPoints;
    totalCredits += semesterCredits;
  }

  cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  document.getElementById('cgpa').textContent = cgpa;
}

function previewSemester(semesterId) {
  const semester = document.querySelector(`#semester-${semesterId}`);
  const rows = semester.querySelectorAll('.subject-list tr');
  let modalBody = `<h3>Semester ${semesterId}</h3><table><thead><tr><th>Subject Name</th><th>Grade</th><th>Credits</th></tr></thead><tbody>`;

  rows.forEach((row) => {
    const subjectName = row.querySelector('input[type="text"]').value;
    const grade = row.querySelector('.grade').value;
    const credits = row.querySelector('.credits').value;
    modalBody += `<tr><td>${subjectName}</td><td>${grade}</td><td>${credits}</td></tr>`;
  });

  modalBody += `</tbody></table><p>Semester ${semesterId} GPA: ${document.getElementById(`gpa-${semesterId}`).textContent}</p>`;
  modalBody += `<p>Overall CGPA: ${document.getElementById('cgpa').textContent}</p>`;
  document.getElementById('modal-body').innerHTML = modalBody;
  document.getElementById('previewModal').style.display = 'block';
}

function previewAllSemesters() {
  let modalBody = `<h3>All Semesters Results</h3>`;
  for (let i = 1; i <= semesterCount; i++) {
    const semester = document.querySelector(`#semester-${i}`);
    if (!semester) continue;

    const rows = semester.querySelectorAll('.subject-list tr');
    modalBody += `<h4>Semester ${i}</h4><table><thead><tr><th>Subject Name</th><th>Grade</th><th>Credits</th></tr></thead><tbody>`;

    rows.forEach((row) => {
      const subjectName = row.querySelector('input[type="text"]').value;
      const grade = row.querySelector('.grade').value;
      const credits = row.querySelector('.credits').value;
      modalBody += `<tr><td>${subjectName}</td><td>${grade}</td><td>${credits}</td></tr>`;
    });

    modalBody += `</tbody></table><p>Semester ${i} GPA: ${document.getElementById(`gpa-${i}`).textContent}</p>`;
  }
  modalBody += `<p>Overall CGPA: ${document.getElementById('cgpa').textContent}</p>`;
  document.getElementById('modal-body').innerHTML = modalBody;
  document.getElementById('previewModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('previewModal').style.display = 'none';
}

function downloadResults() {
  const modalBody = document.getElementById('modal-body');
  const opt = {
    margin: 1,
    filename: 'semester-results.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(modalBody).set(opt).save();
}

// Attach change listeners to recalculate CGPA dynamically
document.addEventListener('input', calculateCGPA);
document.addEventListener('change', calculateCGPA);