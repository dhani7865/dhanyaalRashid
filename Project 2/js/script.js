// Ensure jQuery is declared before using it
const $ = window.jQuery

$(document).ready(() => {
  // Initial load
  refreshPersonnelTable()
  populateDepartmentDropdowns()
  populateLocationDropdowns()
  $("#filterBtn").prop("disabled", false)

  // --- Event Handlers ---
  // Search input
  let searchTimeout
  $("#searchInp").on("keyup", function () {
    clearTimeout(searchTimeout)
    const searchTerm = $(this).val()
    searchTimeout = setTimeout(() => {
      if ($("#personnelBtn").hasClass("active")) {
        refreshPersonnelTable(searchTerm, $("#filterDepartment").val(), $("#filterLocation").val())
      } else if ($("#departmentsBtn").hasClass("active")) {
        refreshDepartmentsTable(searchTerm)
      } else if ($("#locationsBtn").hasClass("active")) {
        refreshLocationsTable(searchTerm)
      }
    }, 300)
  })

  // Refresh button
  $("#refreshBtn").click(() => {
    $("#searchInp").val("")
    $("#filterDepartment").val("")
    $("#filterLocation").val("")
    if ($("#personnelBtn").hasClass("active")) {
      refreshPersonnelTable()
    } else if ($("#departmentsBtn").hasClass("active")) {
      refreshDepartmentsTable()
    } else {
      refreshLocationsTable()
    }
  })

  // Filter button
  $("#filterBtn").click(() => {
    if ($("#personnelBtn").hasClass("active")) {
      $("#filterPersonnelModal").modal("show")
    }
  })

  // Add button
  $("#addBtn").click(() => {
    if ($("#personnelBtn").hasClass("active")) {
      $("#addPersonnelForm")[0].reset()
      $("#addPersonnelModal").modal("show")
    } else if ($("#departmentsBtn").hasClass("active")) {
      $("#addDepartmentForm")[0].reset()
      $("#addDepartmentModal").modal("show")
    } else {
      $("#addLocationForm")[0].reset()
      $("#addLocationModal").modal("show")
    }
  })

  // Tab navigation
  $("#personnelBtn").click(() => {
    $("#searchInp").val("")
    $("#filterDepartment").val("")
    $("#filterLocation").val("")
    refreshPersonnelTable()
    $("#filterBtn").prop("disabled", false)
  })

  $("#departmentsBtn").click(() => {
    $("#searchInp").val("")
    refreshDepartmentsTable()
    $("#filterBtn").prop("disabled", true)
  })

  $("#locationsBtn").click(() => {
    $("#searchInp").val("")
    refreshLocationsTable()
    $("#filterBtn").prop("disabled", true)
  })

  // --- Form Submissions ---
  // Add Personnel Form
  $("#addPersonnelForm").on("submit", function (e) {
    e.preventDefault()
    const form = $(this)

    if (!form[0].checkValidity()) {
      form[0].reportValidity()
      return
    }

    $.ajax({
      url: "php/insertPersonnel.php",
      type: "POST",
      dataType: "json",
      data: form.serialize(),
      success: (result) => {
        if (result.status.code == 200) {
          form.closest(".modal").modal("hide")
          refreshAllTables()
          populateAllDropdowns()
        }
      },
      error: () => {
        console.error("A server error occurred.")
      },
    })
  })

  // Edit Personnel Form
  $("#editPersonnelForm").on("submit", function (e) {
    e.preventDefault()
    const form = $(this)

    if (!form[0].checkValidity()) {
      form[0].reportValidity()
      return
    }

    $.ajax({
      url: "php/updatePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: form.serialize(),
      success: (result) => {
        if (result.status.code == 200) {
          form.closest(".modal").modal("hide")
          refreshAllTables()
          populateAllDropdowns()
        }
      },
      error: () => {
        console.error("A server error occurred.")
      },
    })
  })

  // Add Department Form
  $("#addDepartmentForm").on("submit", function (e) {
    e.preventDefault()
    const form = $(this)

    if (!form[0].checkValidity()) {
      form[0].reportValidity()
      return
    }

    $.ajax({
      url: "php/insertDepartment.php",
      type: "POST",
      dataType: "json",
      data: form.serialize(),
      success: (result) => {
        if (result.status.code == 200) {
          form.closest(".modal").modal("hide")
          refreshAllTables()
          populateAllDropdowns()
        }
      },
      error: () => {
        console.error("A server error occurred.")
      },
    })
  })

  // Edit Department Form
  $("#editDepartmentForm").on("submit", function (e) {
    e.preventDefault()
    const form = $(this)

    if (!form[0].checkValidity()) {
      form[0].reportValidity()
      return
    }

    $.ajax({
      url: "php/updateDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: form.serialize(),
      success: (result) => {
        if (result.status.code == 200) {
          form.closest(".modal").modal("hide")
          refreshAllTables()
          populateAllDropdowns()
        }
      },
      error: () => {
        console.error("A server error occurred.")
      },
    })
  })

  // Add Location Form
  $("#addLocationForm").on("submit", function (e) {
    e.preventDefault()
    const form = $(this)

    if (!form[0].checkValidity()) {
      form[0].reportValidity()
      return
    }

    $.ajax({
      url: "php/insertLocation.php",
      type: "POST",
      dataType: "json",
      data: form.serialize(),
      success: (result) => {
        if (result.status.code == 200) {
          form.closest(".modal").modal("hide")
          refreshAllTables()
          populateAllDropdowns()
        }
      },
      error: () => {
        console.error("A server error occurred.")
      },
    })
  })

  // Edit Location Form
  $("#editLocationForm").on("submit", function (e) {
    e.preventDefault()
    const form = $(this)

    if (!form[0].checkValidity()) {
      form[0].reportValidity()
      return
    }

    $.ajax({
      url: "php/updateLocationByID.php",
      type: "POST",
      dataType: "json",
      data: form.serialize(),
      success: (result) => {
        if (result.status.code == 200) {
          form.closest(".modal").modal("hide")
          refreshAllTables()
          populateAllDropdowns()
        }
      },
      error: () => {
        console.error("A server error occurred.")
      },
    })
  })

  // Delete Personnel Form
  $("#deletePersonnelForm").on("submit", (e) => {
    e.preventDefault()
    const id = $("#deletePersonnelID").val()

    $.ajax({
      url: "php/deletePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        $("#areYouSurePersonnelModal").modal("hide")
        if (result.status.code == 200) {
          refreshAllTables()
          populateAllDropdowns()
        } else {
          console.error("Error deleting personnel: " + (result.status.description || "Unknown error"))
        }
      },
      error: () => {
        $("#areYouSurePersonnelModal").modal("hide")
        console.error("A server error occurred during deletion.")
      },
    })
  })

  // Delete Department Form
  $("#deleteDepartmentForm").on("submit", (e) => {
    e.preventDefault()
    const id = $("#deleteDepartmentID").val()

    $.ajax({
      url: "php/deleteDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        $("#areYouSureDeleteDepartmentModal").modal("hide")
        if (result.status.code == 200) {
          refreshAllTables()
          populateAllDropdowns()
        } else if (result.status.code == 409) {
          const deptName = $("#areYouSureDeptName").text()
          $("#cantDeleteDeptName").text(deptName)
          $("#cantDeleteDepartmentModal").modal("show")
        } else {
          console.error("Error deleting department: " + (result.status.description || "Unknown error"))
        }
      },
      error: () => {
        $("#areYouSureDeleteDepartmentModal").modal("hide")
        console.error("A server error occurred during deletion.")
      },
    })
  })

  // Delete Location Form
  $("#deleteLocationForm").on("submit", (e) => {
    e.preventDefault()
    const id = $("#deleteLocationID").val()

    $.ajax({
      url: "php/deleteLocationByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        $("#areYouSureDeleteLocationModal").modal("hide")
        if (result.status.code == 200) {
          refreshAllTables()
          populateAllDropdowns()
        } else if (result.status.code == 409) {
          const locName = $("#areYouSureLocationName").text()
          $("#cantDeleteLocationName").text(locName)
          $("#cantDeleteLocationModal").modal("show")
        } else {
          console.error("Error deleting location: " + (result.status.description || "Unknown error"))
        }
      },
      error: () => {
        $("#areYouSureDeleteLocationModal").modal("hide")
        console.error("A server error occurred during deletion.")
      },
    })
  })

  // Filter change events - selecting one sets other to "All" and applies filter
  $("#filterDepartment").on("change", function () {
    if ($(this).val() !== "") {
      $("#filterLocation").val("")
    }
    refreshPersonnelTable($("#searchInp").val(), $("#filterDepartment").val(), $("#filterLocation").val())
  })

  $("#filterLocation").on("change", function () {
    if ($(this).val() !== "") {
      $("#filterDepartment").val("")
    }
    refreshPersonnelTable($("#searchInp").val(), $("#filterDepartment").val(), $("#filterLocation").val())
  })

  // --- Modal show.bs.modal events ---
  // Add Personnel Modal
  $("#addPersonnelModal").on("show.bs.modal", () => {
    populateDepartmentDropdowns()
  })

  // Edit Personnel Modal
  $("#editPersonnelModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget)
    const id = button.data("id")

    // Populate department dropdown first
    populateDepartmentDropdowns()

    // Get personnel data and populate form
    $.ajax({
      url: "php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200 && result.data.personnel && result.data.personnel.length > 0) {
          const p = result.data.personnel[0]
          $("#editPersonnelEmployeeID").val(p.id)
          $("#editPersonnelFirstName").val(p.firstName)
          $("#editPersonnelLastName").val(p.lastName)
          $("#editPersonnelJobTitle").val(p.jobTitle)
          $("#editPersonnelEmailAddress").val(p.email)
          $("#editPersonnelDepartment").val(p.departmentID)
        } else {
          console.error("Error retrieving personnel data.")
        }
      },
      error: () => {
        console.error("AJAX error retrieving personnel data.")
      },
    })
  })

  // Add Department Modal
  $("#addDepartmentModal").on("show.bs.modal", () => {
    populateLocationDropdowns()
  })

  // Edit Department Modal
  $("#editDepartmentModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget)
    const id = button.data("id")

    // Populate location dropdown first
    populateLocationDropdowns()

    // Get department data and populate form
    $.ajax({
      url: "php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200 && result.data && result.data.length > 0) {
          const d = result.data[0]
          $("#editDepartmentID").val(d.id)
          $("#editDepartmentName").val(d.name)
          $("#editDepartmentLocation").val(d.locationID)
        } else {
          console.error("Error retrieving department data.")
        }
      },
      error: () => {
        console.error("AJAX error retrieving department data.")
      },
    })
  })

  // Edit Location Modal
  $("#editLocationModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget)
    const id = button.data("id")

    // Get location data and populate form
    $.ajax({
      url: "php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200 && result.data && result.data.length > 0) {
          $("#editLocationID").val(result.data[0].id)
          $("#editLocationName").val(result.data[0].name)
        } else {
          console.error("Error retrieving location data.")
        }
      },
      error: () => {
        console.error("AJAX error retrieving location data.")
      },
    })
  })

  // Are You Sure Personnel Modal (delete confirmation)
  $("#areYouSurePersonnelModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget)
    const id = button.data("id")

    // Get personnel data to display name and set ID
    $.ajax({
      url: "php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200 && result.data.personnel && result.data.personnel.length > 0) {
          const p = result.data.personnel[0]
          const fullName = `${p.firstName} ${p.lastName}`
          $("#areYouSurePersonnelName").text(fullName)
          $("#deletePersonnelID").val(id)
        } else {
          console.error("Error retrieving personnel data for deletion.")
        }
      },
      error: () => console.error("AJAX error retrieving personnel data for deletion."),
    })
  })

  // Are You Sure Delete Department Modal (delete confirmation)
  $("#areYouSureDeleteDepartmentModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget)
    const id = button.data("id")

    // Get department data to display name and set ID
    $.ajax({
      url: "php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200 && result.data && result.data.length > 0) {
          const deptName = result.data[0].name
          $("#areYouSureDeptName").text(deptName)
          $("#deleteDepartmentID").val(id)
        } else {
          console.error("Error retrieving department data for deletion.")
        }
      },
      error: () => console.error("AJAX error retrieving department data for deletion."),
    })
  })

  // Are You Sure Delete Location Modal (delete confirmation)
  $("#areYouSureDeleteLocationModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget)
    const id = button.data("id")

    // Get location data to display name and set ID
    $.ajax({
      url: "php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200 && result.data && result.data.length > 0) {
          const locName = result.data[0].name
          $("#areYouSureLocationName").text(locName)
          $("#deleteLocationID").val(id)
        } else {
          console.error("Error retrieving location data for deletion.")
        }
      },
      error: () => console.error("AJAX error retrieving location data for deletion."),
    })
  })

  // Filter Personnel Modal
  $("#filterPersonnelModal").on("show.bs.modal", () => {
    // Store current values
    var currentFilterDepartment = $("#filterDepartment").val()
    var currentFilterLocation = $("#filterLocation").val()

    // Clear and rebuild department dropdown
    $.ajax({
      url: "php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: (response) => {
        if (response.status.code === "200" && Array.isArray(response.data)) {
          $("#filterDepartment").empty().append('<option value="">All</option>')
          const sortedDepts = response.data.sort((a, b) => a.name.localeCompare(b.name))
          sortedDepts.forEach((dept) => {
            $("#filterDepartment").append($("<option>", { value: dept.id, text: dept.name }))
          })
          // Restore previous value
          $("#filterDepartment").val(currentFilterDepartment)
        }
      },
    })

    // Clear and rebuild location dropdown
    $.ajax({
      url: "php/getAllLocations.php",
      type: "GET",
      dataType: "json",
      success: (response) => {
        if (response.status.code === "200" && Array.isArray(response.data)) {
          $("#filterLocation").empty().append('<option value="">All</option>')
          const sortedLocs = response.data.sort((a, b) => a.name.localeCompare(b.name))
          sortedLocs.forEach((loc) => {
            $("#filterLocation").append($("<option>", { value: loc.id, text: loc.name }))
          })
          // Restore previous value
          $("#filterLocation").val(currentFilterLocation)
        }
      },
    })
  })
}) // End document ready

// --- Data Loading & Helper Functions ---
function refreshAllTables() {
  refreshPersonnelTable($("#searchInp").val(), $("#filterDepartment").val(), $("#filterLocation").val())
  refreshDepartmentsTable($("#searchInp").val())
  refreshLocationsTable($("#searchInp").val())
}

function populateAllDropdowns() {
  populateDepartmentDropdowns()
  populateLocationDropdowns()
}

function refreshPersonnelTable(searchTerm = "", departmentID = "", locationID = "") {
  $.ajax({
    url: "php/getAll.php",
    type: "POST",
    dataType: "json",
    data: { txt: searchTerm, departmentID: departmentID, locationID: locationID },
    success: (result) => {
      const tableBody = document.getElementById("personnelTableBody")

      // Clear existing content
      tableBody.innerHTML = ""

      if (result.status.code == 200 && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          const row = document.createElement("tr")
          const cell = document.createElement("td")
          cell.setAttribute("colspan", "5")
          cell.classList.add("text-center")
          cell.textContent = "No personnel found."
          row.appendChild(cell)
          tableBody.appendChild(row)
        } else {
          // Use document fragment for better performance
          const fragment = document.createDocumentFragment()

          result.data.forEach((personnel) => {
            const row = document.createElement("tr")

            // Name column (lastName, firstName)
            const nameCell = document.createElement("td")
            nameCell.classList.add("align-middle", "text-nowrap")
            nameCell.textContent = `${personnel.lastName || ""}, ${personnel.firstName || ""}`
            row.appendChild(nameCell)

            // Department column
            const deptCell = document.createElement("td")
            deptCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell")
            deptCell.textContent = personnel.department || "N/A"
            row.appendChild(deptCell)

            // Location column
            const locCell = document.createElement("td")
            locCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell")
            locCell.textContent = personnel.location || "N/A"
            row.appendChild(locCell)

            // Email column
            const emailCell = document.createElement("td")
            emailCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell")
            emailCell.textContent = personnel.email || "N/A"
            row.appendChild(emailCell)

            // Actions column
            const actionsCell = document.createElement("td")
            actionsCell.classList.add("text-end", "text-nowrap")

            // Edit button
            const editBtn = document.createElement("button")
            editBtn.type = "button"
            editBtn.classList.add("btn", "btn-primary", "btn-sm")
            editBtn.setAttribute("data-bs-toggle", "modal")
            editBtn.setAttribute("data-bs-target", "#editPersonnelModal")
            editBtn.setAttribute("data-id", personnel.id)
            editBtn.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>'

            // Delete button
            const deleteBtn = document.createElement("button")
            deleteBtn.type = "button"
            deleteBtn.classList.add("btn", "btn-primary", "btn-sm")
            deleteBtn.setAttribute("data-bs-toggle", "modal")
            deleteBtn.setAttribute("data-bs-target", "#areYouSurePersonnelModal")
            deleteBtn.setAttribute("data-id", personnel.id)
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>'

            actionsCell.appendChild(editBtn)
            actionsCell.appendChild(document.createTextNode(" "))
            actionsCell.appendChild(deleteBtn)
            row.appendChild(actionsCell)

            fragment.appendChild(row)
          })

          tableBody.appendChild(fragment)
        }
      } else {
        const row = document.createElement("tr")
        const cell = document.createElement("td")
        cell.setAttribute("colspan", "5")
        cell.classList.add("text-center")
        cell.textContent = "Error loading personnel data."
        row.appendChild(cell)
        tableBody.appendChild(row)
        console.error("Error/unexpected format in refreshPersonnelTable:", result)
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      const tableBody = document.getElementById("personnelTableBody")
      tableBody.innerHTML = ""
      const row = document.createElement("tr")
      const cell = document.createElement("td")
      cell.setAttribute("colspan", "5")
      cell.classList.add("text-center")
      cell.textContent = "AJAX error fetching personnel."
      row.appendChild(cell)
      tableBody.appendChild(row)
      console.error("AJAX Error in refreshPersonnelTable:", textStatus, errorThrown)
    },
  })
}

function refreshDepartmentsTable(searchTerm = "") {
  $.ajax({
    url: "php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    data: { txt: searchTerm },
    success: (result) => {
      const tableBody = document.getElementById("departmentTableBody")
      tableBody.innerHTML = ""

      if (result.status.code == 200 && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          const row = document.createElement("tr")
          const cell = document.createElement("td")
          cell.setAttribute("colspan", "3")
          cell.classList.add("text-center")
          cell.textContent = "No departments found."
          row.appendChild(cell)
          tableBody.appendChild(row)
        } else {
          const fragment = document.createDocumentFragment()

          result.data.forEach((department) => {
            const row = document.createElement("tr")

            // Name column
            const nameCell = document.createElement("td")
            nameCell.classList.add("align-middle", "text-nowrap")
            nameCell.textContent = department.name || "N/A"
            row.appendChild(nameCell)

            // Location column
            const locCell = document.createElement("td")
            locCell.classList.add("align-middle", "text-nowrap", "d-none", "d-md-table-cell")
            locCell.textContent = department.locationName || "N/A"
            row.appendChild(locCell)

            // Actions column
            const actionsCell = document.createElement("td")
            actionsCell.classList.add("align-middle", "text-end", "text-nowrap")

            // Edit button
            const editBtn = document.createElement("button")
            editBtn.type = "button"
            editBtn.classList.add("btn", "btn-primary", "btn-sm")
            editBtn.setAttribute("data-bs-toggle", "modal")
            editBtn.setAttribute("data-bs-target", "#editDepartmentModal")
            editBtn.setAttribute("data-id", department.id)
            editBtn.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>'

            // Delete button
            const deleteBtn = document.createElement("button")
            deleteBtn.type = "button"
            deleteBtn.classList.add("btn", "btn-primary", "btn-sm")
            deleteBtn.setAttribute("data-bs-toggle", "modal")
            deleteBtn.setAttribute("data-bs-target", "#areYouSureDeleteDepartmentModal")
            deleteBtn.setAttribute("data-id", department.id)
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>'

            actionsCell.appendChild(editBtn)
            actionsCell.appendChild(document.createTextNode(" "))
            actionsCell.appendChild(deleteBtn)
            row.appendChild(actionsCell)

            fragment.appendChild(row)
          })

          tableBody.appendChild(fragment)
        }
      } else {
        const row = document.createElement("tr")
        const cell = document.createElement("td")
        cell.setAttribute("colspan", "3")
        cell.classList.add("text-center")
        cell.textContent = "Error loading department data."
        row.appendChild(cell)
        tableBody.appendChild(row)
        console.error("Error/unexpected format in refreshDepartmentsTable:", result)
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      const tableBody = document.getElementById("departmentTableBody")
      tableBody.innerHTML = ""
      const row = document.createElement("tr")
      const cell = document.createElement("td")
      cell.setAttribute("colspan", "3")
      cell.classList.add("text-center")
      cell.textContent = "AJAX error fetching departments."
      row.appendChild(cell)
      tableBody.appendChild(row)
      console.error("AJAX Error in refreshDepartmentsTable:", textStatus, errorThrown)
    },
  })
}

function refreshLocationsTable(searchTerm = "") {
  $.ajax({
    url: "php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    data: { txt: searchTerm },
    success: (result) => {
      const tableBody = document.getElementById("locationTableBody")
      tableBody.innerHTML = ""

      if (result.status.code == 200 && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          const row = document.createElement("tr")
          const cell = document.createElement("td")
          cell.setAttribute("colspan", "2")
          cell.classList.add("text-center")
          cell.textContent = "No locations found."
          row.appendChild(cell)
          tableBody.appendChild(row)
        } else {
          const fragment = document.createDocumentFragment()

          result.data.forEach((location) => {
            const row = document.createElement("tr")

            // Name column
            const nameCell = document.createElement("td")
            nameCell.classList.add("align-middle", "text-nowrap")
            nameCell.textContent = location.name || "N/A"
            row.appendChild(nameCell)

            // Actions column
            const actionsCell = document.createElement("td")
            actionsCell.classList.add("align-middle", "text-end", "text-nowrap")

            // Edit button
            const editBtn = document.createElement("button")
            editBtn.type = "button"
            editBtn.classList.add("btn", "btn-primary", "btn-sm")
            editBtn.setAttribute("data-bs-toggle", "modal")
            editBtn.setAttribute("data-bs-target", "#editLocationModal")
            editBtn.setAttribute("data-id", location.id)
            editBtn.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>'

            // Delete button
            const deleteBtn = document.createElement("button")
            deleteBtn.type = "button"
            deleteBtn.classList.add("btn", "btn-primary", "btn-sm")
            deleteBtn.setAttribute("data-bs-toggle", "modal")
            deleteBtn.setAttribute("data-bs-target", "#areYouSureDeleteLocationModal")
            deleteBtn.setAttribute("data-id", location.id)
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>'

            actionsCell.appendChild(editBtn)
            actionsCell.appendChild(document.createTextNode(" "))
            actionsCell.appendChild(deleteBtn)
            row.appendChild(actionsCell)

            fragment.appendChild(row)
          })

          tableBody.appendChild(fragment)
        }
      } else {
        const row = document.createElement("tr")
        const cell = document.createElement("td")
        cell.setAttribute("colspan", "2")
        cell.classList.add("text-center")
        cell.textContent = "Error loading location data."
        row.appendChild(cell)
        tableBody.appendChild(row)
        console.error("Error/unexpected format in refreshLocationsTable:", result)
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      const tableBody = document.getElementById("locationTableBody")
      tableBody.innerHTML = ""
      const row = document.createElement("tr")
      const cell = document.createElement("td")
      cell.setAttribute("colspan", "2")
      cell.classList.add("text-center")
      cell.textContent = "AJAX error fetching locations."
      row.appendChild(cell)
      tableBody.appendChild(row)
      console.error("AJAX Error in refreshLocationsTable:", textStatus, errorThrown)
    },
  })
}

function populateDepartmentDropdowns() {
  $.ajax({
    url: "php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: (response) => {
      if (response.status.code === "200" && Array.isArray(response.data)) {
        // For add/edit modals - use "Select Department"
        const $addEditSelects = $("#addPersonnelDepartment, #editPersonnelDepartment")
        $addEditSelects.empty().append('<option value="">Select Department</option>')

        // For filter modal - use "All"
        const $filterSelect = $("#filterDepartment")
        $filterSelect.empty().append('<option value="">All</option>')

        // Sort departments alphabetically
        const sortedDepts = response.data.sort((a, b) => a.name.localeCompare(b.name))

        sortedDepts.forEach((dept) => {
          $addEditSelects.append($("<option>", { value: dept.id, text: dept.name }))
          $filterSelect.append($("<option>", { value: dept.id, text: dept.name }))
        })
      } else {
        console.error("Failed to populate department dropdowns:", response)
      }
    },
    error: () => console.error("AJAX error populating department dropdowns."),
  })
}

function populateLocationDropdowns() {
  $.ajax({
    url: "php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: (response) => {
      if (response.status.code === "200" && Array.isArray(response.data)) {
        // For add/edit modals - use "Select Location"
        const $addEditSelects = $("#addDepartmentLocation, #editDepartmentLocation")
        $addEditSelects.empty().append('<option value="">Select Location</option>')

        // For filter modal - use "All"
        const $filterSelect = $("#filterLocation")
        $filterSelect.empty().append('<option value="">All</option>')

        // Sort locations alphabetically
        const sortedLocs = response.data.sort((a, b) => a.name.localeCompare(b.name))

        sortedLocs.forEach((loc) => {
          $addEditSelects.append($("<option>", { value: loc.id, text: loc.name }))
          $filterSelect.append($("<option>", { value: loc.id, text: loc.name }))
        })
      } else {
        console.error("Failed to populate location dropdowns:", response)
      }
    },
    error: () => console.error("AJAX error populating location dropdowns."),
  })
}
