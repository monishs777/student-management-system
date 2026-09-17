(() => {
  const STORAGE_KEY = 'sms.students.v1';

  const seedData = [
    { id: cryptoId(), rollNo: '1', name: 'Ananya Rao', className: '10-A', email: 'rao.guardian@example.com', phone: '98450 11223', marks: 88.5 },
    { id: cryptoId(), rollNo: '2', name: 'Kabir Mehta', className: '10-A', email: '', phone: '98450 33445', marks: 64 },
    { id: cryptoId(), rollNo: '3', name: 'Sara Thomas', className: '10-B', email: 'thomas.family@example.com', phone: '', marks: 91 },
    { id: cryptoId(), rollNo: '4', name: 'Vihaan Iyer', className: '9-C', email: '', phone: '99001 22110', marks: 47.5 },
  ];

  let students = loadStudents();
  let sortKey = 'rollNo';
  let sortDir = 'asc';
  let editingId = null;
  let deletingId = null;

  const els = {
    tableBody: document.getElementById('tableBody'),
    emptyState: document.getElementById('emptyState'),
    search: document.getElementById('searchInput'),
    classFilter: document.getElementById('classFilter'),
    addBtn: document.getElementById('addBtn'),
    emptyAddBtn: document.getElementById('emptyAddBtn'),
    exportBtn: document.getElementById('exportBtn'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalTitle: document.getElementById('modalTitle'),
    closeModal: document.getElementById('closeModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    form: document.getElementById('studentForm'),
    formError: document.getElementById('formError'),
    fId: document.getElementById('studentId'),
    fName: document.getElementById('fName'),
    fRoll: document.getElementById('fRoll'),
    fClass: document.getElementById('fClass'),
    fEmail: document.getElementById('fEmail'),
    fPhone: document.getElementById('fPhone'),
    fMarks: document.getElementById('fMarks'),
    deleteBackdrop: document.getElementById('deleteBackdrop'),
    deleteCopy: document.getElementById('deleteCopy'),
    cancelDelete: document.getElementById('cancelDelete'),
    confirmDelete: document.getElementById('confirmDelete'),
    toast: document.getElementById('toast'),
    statTotal: document.getElementById('statTotal'),
    statClasses: document.getElementById('statClasses'),
    statAvg: document.getElementById('statAvg'),
    statTop: document.getElementById('statTop'),
  };

  function cryptoId() {
    return 'id-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function loadStudents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* fall through to seed */ }
    return seedData;
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      showToast("Couldn't save — your browser storage may be full or blocked.");
    }
  }

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => els.toast.classList.remove('show'), 2400);
  }

  function marksClass(m) {
    if (m >= 75) return 'marks-good';
    if (m >= 50) return 'marks-mid';
    return 'marks-low';
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function refreshClassFilterOptions() {
    const current = els.classFilter.value;
    const classes = [...new Set(students.map(s => s.className))].sort();
    els.classFilter.innerHTML = '<option value="">All classes</option>' +
      classes.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    if (classes.includes(current)) els.classFilter.value = current;
  }

  function updateStats() {
    els.statTotal.textContent = students.length;
    const classes = new Set(students.map(s => s.className));
    els.statClasses.textContent = classes.size;
    if (students.length) {
      const avg = students.reduce((sum, s) => sum + Number(s.marks), 0) / students.length;
      els.statAvg.textContent = avg.toFixed(1);
      const top = students.reduce((a, b) => (Number(b.marks) > Number(a.marks) ? b : a));
      els.statTop.textContent = top.name;
    } else {
      els.statAvg.textContent = '—';
      els.statTop.textContent = '—';
    }
  }

  function getFiltered() {
    const q = els.search.value.trim().toLowerCase();
    const cls = els.classFilter.value;
    let list = students.filter(s => {
      const matchesQ = !q || s.name.toLowerCase().includes(q) || String(s.rollNo).toLowerCase().includes(q);
      const matchesCls = !cls || s.className === cls;
      return matchesQ && matchesCls;
    });
    list.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'marks') { av = Number(av); bv = Number(bv); }
      else { av = String(av).toLowerCase(); bv = String(bv).toLowerCase(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }

  function render() {
    refreshClassFilterOptions();
    updateStats();
    const list = getFiltered();
    els.tableBody.innerHTML = '';
    els.emptyState.style.display = students.length === 0 ? 'flex' : 'none';
    document.querySelector('.table-wrap table').style.display = students.length === 0 ? 'none' : 'table';

    document.querySelectorAll('th.sortable').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === sortKey) th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    });

    if (list.length === 0 && students.length > 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6" style="text-align:center; color:var(--ink-soft); padding:32px;">No students match your search.</td>`;
      els.tableBody.appendChild(tr);
      return;
    }

    for (const s of list) {
      const tr = document.createElement('tr');
      const contact = [
        s.email ? `<div>${escapeHtml(s.email)}</div>` : '',
        s.phone ? `<div>${escapeHtml(s.phone)}</div>` : '',
      ].join('') || '<span style="color:var(--ink-soft)">—</span>';

      tr.innerHTML = `
        <td class="roll-cell">${escapeHtml(s.rollNo)}</td>
        <td class="name-cell">${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.className)}</td>
        <td class="contact-cell">${contact}</td>
        <td><span class="marks-pill ${marksClass(Number(s.marks))}"><span class="marks-dot"></span>${Number(s.marks).toFixed(1)}</span></td>
        <td>
          <div class="row-actions">
            <button class="icon-btn" data-action="edit" data-id="${s.id}" aria-label="Edit ${escapeHtml(s.name)}">✎</button>
            <button class="icon-btn danger" data-action="delete" data-id="${s.id}" aria-label="Remove ${escapeHtml(s.name)}">🗑</button>
          </div>
        </td>`;
      els.tableBody.appendChild(tr);
    }
  }

  function openModal(student) {
    editingId = student ? student.id : null;
    els.modalTitle.textContent = student ? 'Edit student' : 'Add student';
    els.fId.value = student ? student.id : '';
    els.fName.value = student ? student.name : '';
    els.fRoll.value = student ? student.rollNo : '';
    els.fClass.value = student ? student.className : '';
    els.fEmail.value = student ? student.email : '';
    els.fPhone.value = student ? student.phone : '';
    els.fMarks.value = student ? student.marks : '';
    els.formError.textContent = '';
    els.modalBackdrop.classList.add('open');
    els.fName.focus();
  }

  function closeModal() {
    els.modalBackdrop.classList.remove('open');
    editingId = null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const name = els.fName.value.trim();
    const rollNo = els.fRoll.value.trim();
    const className = els.fClass.value.trim();
    const email = els.fEmail.value.trim();
    const phone = els.fPhone.value.trim();
    const marks = parseFloat(els.fMarks.value);

    if (!name || !rollNo || !className) {
      els.formError.textContent = 'Name, roll number and class are required.';
      return;
    }
    if (Number.isNaN(marks) || marks < 0 || marks > 100) {
      els.formError.textContent = 'Marks must be a number between 0 and 100.';
      return;
    }
    const dupRoll = students.find(s => s.rollNo === rollNo && s.className === className && s.id !== editingId);
    if (dupRoll) {
      els.formError.textContent = `Roll number ${rollNo} already exists in class ${className}.`;
      return;
    }

    if (editingId) {
      const s = students.find(x => x.id === editingId);
      Object.assign(s, { name, rollNo, className, email, phone, marks });
      showToast('Student updated.');
    } else {
      students.push({ id: cryptoId(), name, rollNo, className, email, phone, marks });
      showToast('Student added.');
    }
    persist();
    closeModal();
    render();
  }

  function openDelete(student) {
    deletingId = student.id;
    els.deleteCopy.textContent = `Remove ${student.name} (Roll ${student.rollNo}, ${student.className}) from the register? This can't be undone.`;
    els.deleteBackdrop.classList.add('open');
  }

  function closeDelete() {
    els.deleteBackdrop.classList.remove('open');
    deletingId = null;
  }

  function exportCsv() {
    if (students.length === 0) { showToast('No students to export yet.'); return; }
    const header = ['Roll No', 'Name', 'Class', 'Guardian Email', 'Guardian Phone', 'Marks'];
    const rows = students.map(s => [s.rollNo, s.name, s.className, s.email, s.phone, s.marks]);
    const csv = [header, ...rows]
      .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Events
  els.addBtn.addEventListener('click', () => openModal(null));
  els.emptyAddBtn.addEventListener('click', () => openModal(null));
  els.closeModal.addEventListener('click', closeModal);
  els.cancelBtn.addEventListener('click', closeModal);
  els.modalBackdrop.addEventListener('click', (e) => { if (e.target === els.modalBackdrop) closeModal(); });
  els.form.addEventListener('submit', handleSubmit);

  els.cancelDelete.addEventListener('click', closeDelete);
  els.deleteBackdrop.addEventListener('click', (e) => { if (e.target === els.deleteBackdrop) closeDelete(); });
  els.confirmDelete.addEventListener('click', () => {
    students = students.filter(s => s.id !== deletingId);
    persist();
    closeDelete();
    render();
    showToast('Student removed.');
  });

  els.tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const student = students.find(s => s.id === btn.dataset.id);
    if (!student) return;
    if (btn.dataset.action === 'edit') openModal(student);
    if (btn.dataset.action === 'delete') openDelete(student);
  });

  els.search.addEventListener('input', render);
  els.classFilter.addEventListener('change', render);
  els.exportBtn.addEventListener('click', exportCsv);

  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      else { sortKey = key; sortDir = 'asc'; }
      render();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeDelete(); }
  });

  persist();
  render();
})();
