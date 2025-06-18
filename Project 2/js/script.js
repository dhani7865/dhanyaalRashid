$(document).ready(() => {
  // Initial load
  refreshPersonnelTable()
  populateDepartmentDropdowns()
  populateLocationDropdowns()
  $("#filterBtn").prop("disabled", false)

  // --- Modal Accessibility Fix ---
  // Ensure aria-hidden is managed correctly when modals are shown/hidden
  const modals = [
    '#areYouSurePersonnelModal',
    '#areYouSureDeleteDepartmentModal',
    '#areYouSureDeleteLocationModal',
    '#cantDeleteDepartmentModal',
    '#cantDeleteLocationModal',
    '#addLocationModal'
  ]
  modals.forEach(modalId => {
    $(modalId).on('show.bs.modal', function () {
      $(this).removeAttr('aria-hidden')
    }).on('hide.bs.modal', function () {
      $(this).attr('aria-hidden', 'true')
    })
  })

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

  // --- Form Submissions (Add/Edit) ---
  $(
    "#addPersonnelForm, #editPersonnelForm, #addDepartmentForm, #editDepartmentForm, #addLocationForm, #editLocationForm",
  ).on("submit", function (e) {
    e.preventDefault()
    const form = $(this)
    const urlMap = {
      addPersonnelForm: "php/insertPersonnel.php",
      editPersonnelForm: "php/updatePersonnelByID.php",
      addDepartmentForm: "php/insertDepartment.php",
      editDepartmentForm: "php/updateDepartmentByID.php",
      addLocationForm: "php/insertLocation.php",
      editLocationForm: "php/updateLocationByID.php",
    }
    const url = urlMap[form.attr("id")]

    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: form.serialize(),
      success: (result) => {
        if (result.status.code == 200) {
          form.closest(".modal").modal("hide")
          const message = result.status.description || "Operation successful!"
          showToast(message, "success")
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

  // --- Filter Logic ---
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

  // --- DELETE LOGIC ---
  $("body").on("click", ".deleteBtn", function () {
    const id = $(this).data("id")
    const type = $(this).data("type")
    const name = $(this).data("name") || "this item"

    // Map data-type to the corresponding confirmation modal
    const modalMap = {
      personnel: "#areYouSurePersonnelModal",
      department: "#areYouSureDeleteDepartmentModal",
      location: "#areYouSureDeleteLocationModal",
    }
    const modalId = modalMap[type]
    if (modalId) {
      $(`${modalId} .modal-body`).text(`Are you sure that you want to delete ${name}?`)
      $(modalId).modal("show")
      // Store id and name for use in confirm button
      $(`${modalId} .btn-outline-primary.btn-sm.myBtn`).data("id", id).data("name", name).data("type", type)
    } else {
    }
  })

  // Handle YES button clicks for all delete modals
  $("body").on("click", ".btn-outline-primary.btn-sm.myBtn", function () {
    const modal = $(this).closest(".modal")
    const modalId = modal.attr("id")
    const id = $(this).data("id")
    const name = $(this).data("name")
    const type = $(this).data("type")

    const urlMap = {
      personnel: "php/deletePersonnelByID.php",
      department: "php/deleteDepartmentByID.php",
      location: "php/deleteLocationByID.php",
    }
    const url = urlMap[type]

    if (!url) {
      modal.modal("hide")
      return
    }

    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: { id: id },
      success: (result) => {
        if (result.status.code == 200) {
          modal.modal("hide")
          showToast(result.status.description || `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, "success")
          refreshAllTables()
          populateAllDropdowns()
        } else if (result.status.code == 409 && type === "department") {
          modal.modal("hide")
          $("#cantDeleteDepartmentModal .modal-body").text(
            `You cannot remove the entry for ${name} because it has employees assigned to it.`
          )
          $("#cantDeleteDepartmentModal").modal("show")
        } else if (result.status.code == 409 && type === "location") {
          modal.modal("hide")
          $("#cantDeleteLocationModal .modal-body").text(
            `You cannot remove the entry for ${name} because it has departments assigned to it.`
          )
          $("#cantDeleteLocationModal").modal("show")
        } else {
          modal.modal("hide")
          showToast("Error deleting: " + (result.status.description || "Unknown error"), "error")
        }
      },
      error: () => {
        modal.modal("hide")
        showToast("A server error occurred during deletion.", "error")
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
      let html = ""
      if (result.status.code == 200 && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          html = '<tr><td colspan="5" class="text-center">No personnel found.</td></tr>'
        } else {
          result.data.forEach((personnel) => {
            html += `<tr>
              <td class="align-middle text-nowrap">${personnel.firstName || ""}, ${personnel.lastName || ""}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.department || "N/A"}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.location || "N/A"}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email || "N/A"}</td>
              <td class="text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${personnel.id}"><i class="fa-solid fa-pencil fa-fw"></i></button>
                <button type="button" class="btn btn-danger btn-sm deleteBtn" data-type="personnel" data-id="${personnel.id}" data-name="${personnel.firstName} ${personnel.lastName}"><i class="fa-solid fa-trash fa-fw"></i></button>
              </td>
            </tr>`
          })
        }
      } else {
        html = '<tr><td colspan="5" class="text-center">Error loading personnel data.</td></tr>'
        console.error("Error/unexpected format in refreshPersonnelTable:", result)
      }
      $("#personnelTableBody").html(html)
    },
    error: (jqXHR, textStatus, errorThrown) => {
      $("#personnelTableBody").html('<tr><td colspan="5" class="text-center">AJAX error fetching personnel.</td></tr>')
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
      let html = ""
      if (result.status.code == 200 && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          html = '<tr><td colspan="3" class="text-center">No departments found.</td></tr>'
        } else {
          result.data.forEach((department) => {
            html += `<tr>
              <td class="align-middle text-nowrap">${department.name || "N/A"}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${department.locationName || "N/A"}</td>
              <td class="align-middle text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.id}"><i class="fa-solid fa-pencil fa-fw"></i></button>
                <button type="button" class="btn btn-danger btn-sm deleteBtn" data-type="department" data-id="${department.id}" data-name="${department.name}"><i class="fa-solid fa-trash fa-fw"></i></button>
              </td>
            </tr>`
          })
        }
      } else {
        html = '<tr><td colspan="3" class="text-center">Error loading department data.</td></tr>'
        console.error("Error/unexpected format in refreshDepartmentsTable:", result)
      }
      $("#departmentTableBody").html(html)
    },
    error: (jqXHR, textStatus, errorThrown) => {
      $("#departmentTableBody").html(
        '<tr><td colspan="3" class="text-center">AJAX error fetching departments.</td></tr>',
      )
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
      let html = ""
      if (result.status.code == 200 && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          html = '<tr><td colspan="2" class="text-center">No locations found.</td></tr>'
        } else {
          result.data.forEach((location) => {
            html += `<tr>
              <td class="align-middle text-nowrap">${location.name || "N/A"}</td>
              <td class="align-middle text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.id}"><i class="fa-solid fa-pencil fa-fw"></i></button>
                <button type="button" class="btn btn-danger btn-sm deleteBtn" data-type="location" data-id="${location.id}" data-name="${location.name}"><i class="fa-solid fa-trash fa-fw"></i></button>
              </td>
            </tr>`
          })
        }
      } else {
        html = '<tr><td colspan="2" class="text-center">Error loading location data.</td></tr>'
        console.error("Error/unexpected format in refreshLocationsTable:", result)
      }
      $("#locationTableBody").html(html)
    },
    error: (jqXHR, textStatus, errorThrown) => {
      $("#locationTableBody").html('<tr><td colspan="2" class="text-center">AJAX error fetching locations.</td></tr>')
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
        response.data.forEach((dept) => {
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
        response.data.forEach((loc) => {
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
  const toast = new bootstrap.Toast(document.getElementById("liveToast"), { delay: 5000 })
  toast.show()
}