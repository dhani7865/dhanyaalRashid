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
    showToast("Data refreshed!")
  })

  // Filter button
  $("#filterBtn").click(() => {
    if ($("#personnelBtn").hasClass("active")) {
      $("#filterPersonnelModal").modal("show")
    } else {
      showToast("Filter is only available for Personnel.", "warning")
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

  // --- Discrete Form Submissions ---
  // Add Personnel Form
  $("#addPersonnelForm").on("submit", function (e) {
    e.preventDefault()
    const form = $(this)

    // Check required fields
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
          showToast("Personnel added successfully!", "success")
          refreshAllTables()
          populateAllDropdowns()
        } else {
          showToast("Error: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => showToast("A server error occurred.", "error"),
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
          showToast("Personnel updated successfully!", "success")
          refreshAllTables()
          populateAllDropdowns()
        } else {
          showToast("Error: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => showToast("A server error occurred.", "error"),
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
          showToast("Department added successfully!", "success")
          refreshAllTables()
          populateAllDropdowns()
        } else {
          showToast("Error: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => showToast("A server error occurred.", "error"),
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
          showToast("Department updated successfully!", "success")
          refreshAllTables()
          populateAllDropdowns()
        } else {
          showToast("Error: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => showToast("A server error occurred.", "error"),
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
          showToast("Location added successfully!", "success")
          refreshAllTables()
          populateAllDropdowns()
        } else {
          showToast("Error: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => showToast("A server error occurred.", "error"),
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
          showToast("Location updated successfully!", "success")
          refreshAllTables()
          populateAllDropdowns()
        } else {
          showToast("Error: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => showToast("A server error occurred.", "error"),
    })
  })

  // --- Modal Opening Logic (Edit) ---
  $("#personnelTableBody").on("click", 'button[data-bs-target="#editPersonnelModal"]', function () {
    const id = $(this).data("id")
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
          $("#editPersonnelModal").modal("show")
        } else {
          showToast("Error retrieving personnel data.", "error")
        }
      },
      error: () => showToast("AJAX error retrieving personnel data.", "error"),
    })
  })

  $("#departmentTableBody").on("click", 'button[data-bs-target="#editDepartmentModal"]', function () {
    const id = $(this).data("id")
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
          $("#editDepartmentModal").modal("show")
        } else {
          showToast("Error retrieving department data.", "error")
        }
      },
      error: () => showToast("AJAX error retrieving department data.", "error"),
    })
  })

  $("#locationTableBody").on("click", 'button[data-bs-target="#editLocationModal"]', function () {
    const id = $(this).data("id")
    $.ajax({
      url: "php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200 && result.data && result.data.length > 0) {
          $("#editLocationID").val(result.data[0].id)
          $("#editLocationName").val(result.data[0].name)
          $("#editLocationModal").modal("show")
        } else {
          showToast("Error retrieving location data.", "error")
        }
      },
      error: () => showToast("AJAX error retrieving location data.", "error"),
    })
  })

  // --- Filter Logic (OR instead of AND) ---
  $("#applyPersonnelFilterBtn").click(() => {
    refreshPersonnelTable($("#searchInp").val(), $("#filterDepartment").val(), $("#filterLocation").val())
    $("#filterPersonnelModal").modal("hide")
    showToast("Filter applied.")
  })

  $("#clearPersonnelFilterBtn").click(() => {
    $("#filterDepartment").val("")
    $("#filterLocation").val("")
    refreshPersonnelTable($("#searchInp").val())
    $("#filterPersonnelModal").modal("hide")
    showToast("Filter cleared.")
  })

  // --- DELETE LOGIC with immediate dependency checking ---
  // Personnel delete - direct confirmation
  $("body").on("click", ".deletePersonnelBtn", function () {
    const id = $(this).data("id")
    const name = $(this).data("name")

    $("#areYouSurePersonnelName").text(name)
    $("#confirmDeletePersonnelBtn").data("id", id)
    $("#areYouSurePersonnelModal").modal("show")
  })

  // Confirm personnel delete
  $("#confirmDeletePersonnelBtn").click(function () {
    const id = $(this).data("id")

    $.ajax({
      url: "php/deletePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        $("#areYouSurePersonnelModal").modal("hide")
        if (result.status.code == 200) {
          showToast("Personnel deleted successfully!", "success")
          refreshAllTables()
          populateAllDropdowns()
        } else {
          showToast("Error deleting personnel: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => {
        $("#areYouSurePersonnelModal").modal("hide")
        showToast("A server error occurred during deletion.", "error")
      },
    })
  })

  // Department delete with dependency check
  $("body").on("click", ".deleteDepartmentBtn", function () {
    const id = $(this).data("id")
    const name = $(this).data("name")

    // Check for dependencies immediately
    $.ajax({
      url: "php/deleteDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200) {
          showToast("Department deleted successfully!", "success")
          refreshAllTables()
          populateAllDropdowns()
        } else if (result.status.code == 409) {
          $("#cantDeleteDepartmentModal .modal-body").text(
            `You cannot remove the entry for ${name} because it has employees assigned to it.`,
          )
          $("#cantDeleteDepartmentModal").modal("show")
        } else {
          showToast("Error deleting department: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => showToast("A server error occurred during deletion.", "error"),
    })
  })

  // Location delete with dependency check
  $("body").on("click", ".deleteLocationBtn", function () {
    const id = $(this).data("id")
    const name = $(this).data("name")

    // Check for dependencies immediately
    $.ajax({
      url: "php/deleteLocationByID.php",
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200) {
          showToast("Location deleted successfully!", "success")
          refreshAllTables()
          populateAllDropdowns()
        } else if (result.status.code == 409) {
          $("#cantDeleteLocationModal .modal-body").text(
            `You cannot remove the entry for ${name} because it has departments assigned to it.`,
          )
          $("#cantDeleteLocationModal").modal("show")
        } else {
          showToast("Error deleting location: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => showToast("A server error occurred during deletion.", "error"),
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
            deleteBtn.classList.add("btn", "btn-primary", "btn-sm", "deletePersonnelBtn")
            deleteBtn.setAttribute("data-id", personnel.id)
            deleteBtn.setAttribute("data-name", `${personnel.firstName} ${personnel.lastName}`)
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
            deleteBtn.classList.add("btn", "btn-primary", "btn-sm", "deleteDepartmentBtn")
            deleteBtn.setAttribute("data-id", department.id)
            deleteBtn.setAttribute("data-name", department.name)
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
            deleteBtn.classList.add("btn", "btn-primary", "btn-sm", "deleteLocationBtn")
            deleteBtn.setAttribute("data-id", location.id)
            deleteBtn.setAttribute("data-name", location.name)
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
        const $selects = $("#addPersonnelDepartment, #editPersonnelDepartment, #filterDepartment")
        $selects.empty().append('<option value="">Select Department</option>')

        // Sort departments alphabetically
        const sortedDepts = response.data.sort((a, b) => a.name.localeCompare(b.name))

        sortedDepts.forEach((dept) => {
          $selects.append($("<option>", { value: dept.id, text: dept.name }))
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
        const $selects = $("#addDepartmentLocation, #editDepartmentLocation, #filterLocation")
        $selects.empty().append('<option value="">Select Location</option>')

        // Sort locations alphabetically
        const sortedLocs = response.data.sort((a, b) => a.name.localeCompare(b.name))

        sortedLocs.forEach((loc) => {
          $selects.append($("<option>", { value: loc.id, text: loc.name }))
        })
      } else {
        console.error("Failed to populate location dropdowns:", response)
      }
    },
    error: () => console.error("AJAX error populating location dropdowns."),
  })
}

function showToast(message, type = "success") {
  $("#liveToast").remove()
  const toastHTML = `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header ${type === "error" ? "bg-danger text-white" : type === "warning" ? "bg-warning text-dark" : type === "info" ? "bg-info text-white" : "bg-success text-white"}">
          <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
          <button type="button" class="btn-close ${type !== "success" && type !== "info" ? "btn-close-white" : ""}" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>
    </div>`
  $("body").append(toastHTML)
  const toast = new window.bootstrap.Toast(document.getElementById("liveToast"), { delay: 5000 })
  toast.show()
}
