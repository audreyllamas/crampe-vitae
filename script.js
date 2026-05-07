const defaultImage = 'https://via.placeholder.com/140x140.png?text=Photo';

const fields = [
  'fullName',
  'jobTitle',
  'contactNumber',
  'email',
  'address',
  'objective',
  'education',
  'experience',
  'skills',
  'certifications',
  'tools',
  'languages',
  'achievements',
  'references'
];

fields.forEach((id) => {
  document.getElementById(id).addEventListener('input', generateResume);
});

document.getElementById('profileImage').addEventListener('change', handleImageUpload);



function getLines(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');
}

function createListItems(lines) {
  if (lines.length === 0) {
    return '<li class="placeholder">No details added.</li>';
  }

  return lines.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function parseStructuredEntries(lines) {
  return lines.map(line => {
    const parts = line.split('|').map(part => part.trim());

    return {
      title: parts[0] || '',
      subtitle: parts[1] || '',
      description: parts[2] || ''
    };
  });
}

function createStructuredHtml(lines) {
  if (lines.length === 0) {
    return '<p class="placeholder">No details added.</p>';
  }

  const entries = parseStructuredEntries(lines);

  return entries.map(entry => `
    <div class="entry">
      <strong>${escapeHtml(entry.title)}</strong>
      ${entry.subtitle ? `<div class="muted">${escapeHtml(entry.subtitle)}</div>` : ''}
      ${entry.description ? `<div>${escapeHtml(entry.description)}</div>` : ''}
    </div>
  `).join('');
}

function createReferenceHtml(lines) {
  if (lines.length === 0) {
    return '<p class="placeholder">No references added.</p>';
  }

  return lines.map(line => {
    const parts = line.split(' - ').map(part => part.trim());

    const name = parts[0] || '';
    const role = parts[1] || '';
    const email = parts[2] || '';

    return `
      <div class="reference-entry">
        <div class="reference-name">${escapeHtml(name)}</div>
        ${role ? `<div class="reference-role">${escapeHtml(role)}</div>` : ''}
        ${email ? `<div class="reference-email">${escapeHtml(email)}</div>` : ''}
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toggleBlock(blockId, hasContent) {
  const block = document.getElementById(blockId);
  block.style.display = hasContent ? 'block' : 'none';
}


/* =========================
   RESUME GENERATOR
========================= */

function generateResume() {
  const fullName = document.getElementById('fullName').value.trim();
  const jobTitle = document.getElementById('jobTitle').value.trim();
  const contactNumber = document.getElementById('contactNumber').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const objective = document.getElementById('objective').value.trim();

  const education = getLines(document.getElementById('education').value);
  const experience = getLines(document.getElementById('experience').value);
  const skills = getLines(document.getElementById('skills').value);
  const certifications = getLines(document.getElementById('certifications').value);
  const tools = getLines(document.getElementById('tools').value);
  const languages = getLines(document.getElementById('languages').value);
  const achievements = getLines(document.getElementById('achievements').value);
  const references = getLines(document.getElementById('references').value);

  document.getElementById('previewName').textContent = fullName || 'YOUR NAME';
  document.getElementById('previewJobTitle').textContent = jobTitle || 'Desired Job Title';
  document.getElementById('previewPhone').textContent = contactNumber || 'No contact number yet';
  document.getElementById('previewEmail').textContent = email || 'No email yet';
  document.getElementById('previewAddress').textContent = address || 'No address yet';

  document.getElementById('previewObjective').innerHTML = objective
    ? escapeHtml(objective)
    : '<span class="placeholder">Your career objective will appear here.</span>';

  document.getElementById('previewEducation').innerHTML = createStructuredHtml(education);
  document.getElementById('previewExperience').innerHTML = createStructuredHtml(experience);
  document.getElementById('previewSkills').innerHTML = createListItems(skills);
  document.getElementById('previewCertifications').innerHTML = createListItems(certifications);
  document.getElementById('previewTools').innerHTML = createListItems(tools);
  document.getElementById('previewLanguages').innerHTML = createListItems(languages);
  document.getElementById('previewAchievements').innerHTML = createListItems(achievements);
  document.getElementById('previewReferences').innerHTML = createReferenceHtml(references);

  toggleBlock('objectiveBlock', objective !== '');
  toggleBlock('educationBlock', education.length > 0);
  toggleBlock('experienceBlock', experience.length > 0);
  toggleBlock('skillsBlock', skills.length > 0);
  toggleBlock('certificationsBlock', certifications.length > 0);
  toggleBlock('toolsBlock', tools.length > 0);
  toggleBlock('languagesBlock', languages.length > 0);
  toggleBlock('achievementsBlock', achievements.length > 0);
  toggleBlock('referencesBlock', references.length > 0);

  updateSuggestions({
    fullName,
    jobTitle,
    contactNumber,
    email,
    address,
    objective,
    education,
    experience,
    skills,
    certifications,
    tools,
    languages,
    achievements,
    references
  });
}


/* =========================
   RESUME SUGGESTIONS
========================= */

function updateSuggestions(data) {
  const suggestions = [];

  if (!data.fullName) suggestions.push('Add your full name.');
  if (!data.jobTitle) suggestions.push('Add your desired job title.');
  if (!data.contactNumber) suggestions.push('Add a contact number.');
  if (!data.email) suggestions.push('Add an email address.');
  if (!data.address) suggestions.push('Add your address.');
  if (!data.objective) suggestions.push('Career objective is missing.');
  if (data.education.length === 0) suggestions.push('Education section is empty.');
  if (data.experience.length === 0) suggestions.push('Work experience section is empty.');
  if (data.skills.length < 3) suggestions.push('Add at least 3 skills.');
  if (data.tools.length === 0) suggestions.push('Add tools you can use.');
  if (data.languages.length === 0) suggestions.push('Add languages you can speak.');
  if (data.references.length === 0) suggestions.push('Consider adding at least 1 reference.');

  const list = document.getElementById('suggestionsList');

  if (suggestions.length === 0) {
    list.innerHTML = '<li>Your resume looks complete and well-filled.</li>';
  } else {
    list.innerHTML = suggestions.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  }
}


/* =========================
   IMAGE UPLOAD
========================= */

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    document.getElementById('previewImage').src = e.target.result;
  };

  reader.readAsDataURL(file);
}


/* =========================
   FORM ACTIONS
========================= */

function clearForm() {
  fields.forEach((id) => {
    document.getElementById(id).value = '';
  });

  document.getElementById('profileImage').value = '';
  document.getElementById('previewImage').src = defaultImage;

  generateResume();
}

function fillSampleData() {
  document.getElementById('fullName').value = 'Audrey Justine Ruth V. Llamas';
  document.getElementById('jobTitle').value = 'Entry-Level Web Developer';
  document.getElementById('contactNumber').value = '+63 912 345 6789';
  document.getElementById('email').value = 'audreyllamas@email.com';
  document.getElementById('address').value = 'Quezon City, Philippines';

  document.getElementById('objective').value =
    'A motivated and detail-oriented student seeking an opportunity to apply technical and communication skills in a professional work environment while continuously learning and contributing to organizational goals.';

  document.getElementById('education').value =
    'Bachelor of Science in Computer Science | Polytechnic University of the Philippines | 2022 - Present\nSenior High School | Example Senior High School | 2020 - 2022';

  document.getElementById('experience').value =
    'Web Development Intern | Accenture Philippines | Assisted in front-end testing, website updates, and documentation of system features\nStudent Project Leader | Polytechnic University of the Philippines | Led the development of a web-based information system for academic requirements';

  document.getElementById('skills').value =
    'HTML\nCSS\nJavaScript\nProblem Solving\nCommunication';

  document.getElementById('certifications').value =
    'Introduction to Web Development Certificate\nGoogle Digital Skills Certificate';

  document.getElementById('tools').value =
    'VS Code\nGitHub\nFigma\nCanva\nMicrosoft Office';

    document.getElementById('languages').value =
  'Filipino\nEnglish';

document.getElementById('achievements').value =
  'Introduction to Web Development\nGoogle Digital Skills\nAcademic Web-Based Projects\nSystem Development Coursework';

  document.getElementById('references').value =
    'Lharsen Denielle Miranda - Software Engineer - lharsen.miranda@gmail.com\nAshley Shein - IT Supervisor - ashley.shein@gmail.com';

  generateResume();
}


/* =========================
   RESUME COLOR CHANGER
========================= */

function changeResumeColor(color, el) {
  document.documentElement.style.setProperty('--resume-theme', color);

  const circles = document.querySelectorAll('.color-circle');
  circles.forEach(circle => circle.classList.remove('active'));

  if (el) {
    el.classList.add('active');
  }
}


/* =========================
   EXPORT AS IMAGE
========================= */

function saveResumeAsImage() {
  const resume = document.getElementById('resumePreview');

  html2canvas(resume, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = 'Resume and Go.png';
    link.click();
  });
}


/* =========================
   EXPORT AS PDF
========================= */

async function saveResumeAsPDF() {
  const resume = document.getElementById('resumePreview');
  const { jsPDF } = window.jspdf;

  const canvas = await html2canvas(resume, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;

  const x = (pageWidth - finalWidth) / 2;
  const y = (pageHeight - finalHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
  pdf.save('Resume and Go.pdf');
}



generateResume();
