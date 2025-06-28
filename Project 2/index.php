<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Company Directory</title>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.1/css/bootstrap.min.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'>
    <link rel="stylesheet" href="./css/styles.css?v=1.0.2">
</head>

<body>

    <section>
        <div class="appHeader">
            <div class="row">
                <div class="col">
                    <input id="searchInp" class="form-control mb-3" placeholder="search">
                </div>
                <div class="col-5 text-end me-2">
                    <div class="btn-group" role="group" aria-label="buttons">
                        <button id="refreshBtn" type="button" class="btn btn-primary">
                            <i class="fa-solid fa-refresh fa-fw"></i>
                        </button>
                        <button id="filterBtn" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#filterPersonnelModal">
                            <i class="fa-solid fa-filter fa-fw"></i>
                        </button>
                        <button id="addBtn" type="button" class="btn btn-primary">
                            <i class="fa-solid fa-plus fa-fw"></i>
                        </button>
                    </div>
                </div>
            </div>

            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="personnelBtn" data-bs-toggle="tab" data-bs-target="#personnel-tab-pane" type="button" role="tab" aria-controls="personnel-tab-pane" aria-selected="true">
                        <i class="fa-solid fa-person fa-lg fa-fw"></i><span class="d-none d-sm-block">Personnel</span>
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="departmentsBtn" data-bs-toggle="tab" data-bs-target="#departments-tab-pane" type="button" role="tab" aria-controls="departments-tab-pane" aria-selected="false">
                        <i class="fa-solid fa-building fa-lg fa-fw"></i><span class="d-none d-sm-block">Departments</span>
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="locationsBtn" data-bs-toggle="tab" data-bs-target="#locations-tab-pane" type="button" role="tab" aria-controls="locations-tab-pane" aria-selected="false">
                        <i class="fa-solid fa-map-location-dot fa-lg fa-fw"></i><span class="d-none d-sm-block">Locations</span>
                    </button>
                </li>
            </ul>
        </div>

        <div class="tab-content bg-white">
            <div class="tab-pane show active" id="personnel-tab-pane" role="tabpanel" aria-labelledby="personnel-tab" tabindex="0">
                <table class="table table-hover">
                    <tbody id="personnelTableBody">
                        <tr>
                            <td class="align-middle text-nowrap">Ace, Tamarra</td>
                            <td class="align-middle text-nowrap d-none d-md-table-cell">Support</td>
                            <td class="align-middle text-nowrap d-none d-md-table-cell">Munich</td>
                            <td class="align-middle text-nowrap d-none d-md-table-cell">tacem@vinaora.com</td>
                            <td class="text-end text-nowrap">
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="23">
                                    <i class="fa-solid fa-pencil fa-fw"></i>
                                </button>
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#areYouSurePersonnelModal" data-id="23">
                                    <i class="fa-solid fa-trash fa-fw"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="tab-pane" id="departments-tab-pane" role="tabpanel" aria-labelledby="departments-tab" tabindex="0">
                <table class="table table-hover">
                    <tbody id="departmentTableBody">
                        <tr>
                            <td class="align-middle text-nowrap">Human resources</td>
                            <td class="align-middle text-nowrap d-none d-md-table-cell">London</td>
                            <td class="align-middle text-end text-nowrap">
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="1">
                                    <i class="fa-solid fa-pencil fa-fw"></i>
                                </button>
                                <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="1">
                                    <i class="fa-solid fa-trash fa-fw"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle text-nowrap">Not used</td>
                            <td class="align-middle text-nowrap d-none d-md-table-cell">London</td>
                            <td class="align-middle text-end text-nowrap">
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="20">
                                    <i class="fa-solid fa-pencil fa-fw"></i>
                                </button>
                                <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="20">
                                    <i class="fa-solid fa-trash fa-fw"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="tab-pane" id="locations-tab-pane" role="tabpanel" aria-labelledby="locations-tab" tabindex="0">
                <table class="table table-hover">
                    <tbody id="locationTableBody">
                        <tr>
                            <td class="align-middle text-nowrap">London</td>
                            <td class="align-middle text-end text-nowrap">
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="1">
                                    <i class="fa-solid fa-pencil fa-fw"></i>
                                </button>
                                <button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-id="1">
                                    <i class="fa-solid fa-trash fa-fw"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <footer class="border-top text-center fw-bold">
            <p class="fw-light my-3" data-copyright="200009">&copy; ITCS 2023 - Do not distribute</p>
        </footer>
    </section>

    <!-- Edit Personnel Modal -->
    <div id="editPersonnelModal" class="modal fade" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="editPersonnelModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content shadow">
                <div class="modal-header bg-primary bg-gradient text-white">
                    <h5 class="modal-title">Edit employee</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editPersonnelForm">
                        <input type="hidden" id="editPersonnelEmployeeID" name="editPersonnelEmployeeID">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="editPersonnelFirstName" name="editPersonnelFirstName" placeholder="First name" required>
                            <label for="editPersonnelFirstName">First name</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="editPersonnelLastName" name="editPersonnelLastName" placeholder="Last name" required>
                            <label for="editPersonnelLastName">Last name</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="editPersonnelJobTitle" name="editPersonnelJobTitle" placeholder="Job title" required>
                            <label for="editPersonnelJobTitle">Job Title</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="editPersonnelEmailAddress" name="editPersonnelEmailAddress" placeholder="Email address" required>
                            <label for="editPersonnelEmailAddress">Email Address</label>
                        </div>
                        <div class="form-floating">
                            <select class="form-select" id="editPersonnelDepartment" name="editPersonnelDepartment" placeholder="Department">
                            </select>
                            <label for="editPersonnelDepartment">Department</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" form="editPersonnelForm" class="btn btn-outline-primary btn-sm myBtn">SAVE</button>
                    <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">CANCEL</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Personnel Modal -->
    <div class="modal fade" id="addPersonnelModal" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="addPersonnelModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content shadow">
                <form id="addPersonnelForm">
                    <div class="modal-header bg-primary bg-gradient text-white">
                        <h5 class="modal-title" id="addPersonnelModalLabel">Add New Personnel</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="addPersonnelFirstName" name="addPersonnelFirstName" placeholder="First Name" required>
                            <label for="addPersonnelFirstName">First Name</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="addPersonnelLastName" name="addPersonnelLastName" placeholder="Last Name" required>
                            <label for="addPersonnelLastName">Last Name</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="addPersonnelJobTitle" name="addPersonnelJobTitle" placeholder="Job Title">
                            <label for="addPersonnelJobTitle">Job Title</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="addPersonnelEmailAddress" name="addPersonnelEmailAddress" placeholder="Email Address" required>
                            <label for="addPersonnelEmailAddress">Email Address</label>
                        </div>
                        <div class="form-floating">
                            <select class="form-select" id="addPersonnelDepartment" name="addPersonnelDepartment" required>
                                <option value="">Select Department</option>
                            </select>
                            <label for="addPersonnelDepartment">Department</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-primary btn-sm myBtn">SAVE</button>
                        <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Add Department Modal -->
    <div class="modal fade" id="addDepartmentModal" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="addDepartmentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content shadow">
                <form id="addDepartmentForm">
                    <div class="modal-header bg-primary bg-gradient text-white">
                        <h5 class="modal-title" id="addDepartmentModalLabel">Add Department</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="addDepartmentName" name="name" placeholder="Department Name" required>
                            <label for="addDepartmentName">Department Name</label>
                        </div>
                        <div class="form-floating">
                            <select class="form-select" id="addDepartmentLocation" name="locationID" required>
                                <option value="">Select Location</option>
                            </select>
                            <label for="addDepartmentLocation">Location</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-primary btn-sm myBtn">SAVE</button>
                        <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Department Modal -->
    <div class="modal fade" id="editDepartmentModal" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="editDepartmentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content shadow">
                <form id="editDepartmentForm">
                    <input type="hidden" id="editDepartmentID" name="id">
                    <div class="modal-header bg-primary bg-gradient text-white">
                        <h5 class="modal-title" id="editDepartmentModalLabel">Edit Department</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="editDepartmentName" name="name" placeholder="Department Name" required>
                            <label for="editDepartmentName">Department Name</label>
                        </div>
                        <div class="form-floating">
                            <select class="form-select" id="editDepartmentLocation" name="locationID" required>
                                <option value="">Select Location</option>
                            </select>
                            <label for="editDepartmentLocation">Location</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-primary btn-sm myBtn">SAVE</button>
                        <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Add Location Modal -->
    <div class="modal fade" id="addLocationModal" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="addLocationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content shadow">
                <form id="addLocationForm">
                    <div class="modal-header bg-primary bg-gradient text-white">
                        <h5 class="modal-title" id="addLocationModalLabel">Add Location</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="addLocationName" name="name" placeholder="Location Name" required>
                            <label for="addLocationName">Location Name</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-primary btn-sm myBtn">SAVE</button>
                        <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Location Modal -->
    <div class="modal fade" id="editLocationModal" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="editLocationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content shadow">
                <form id="editLocationForm">
                    <input type="hidden" id="editLocationID" name="id">
                    <div class="modal-header bg-primary bg-gradient text-white">
                        <h5 class="modal-title" id="editLocationModalLabel">Edit Location</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="editLocationName" name="name" placeholder="Location Name" required>
                            <label for="editLocationName">Location Name</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-primary btn-sm myBtn">SAVE</button>
                        <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Filter Personnel Modal -->
    <div id="filterPersonnelModal" class="modal fade" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="filterPersonnelModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content modal-sm shadow">
                <div class="modal-header bg-primary bg-gradient text-white">
                    <h5 class="modal-title">Filter employees</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="filterPersonnelForm">
                        <div class="form-floating mb-3">
                            <select class="form-select" id="filterDepartment" name="filterDepartment">
                                <option value="">All</option>
                            </select>
                            <label for="filterDepartment">Department</label>
                        </div>
                        <div class="form-floating">
                            <select class="form-select" id="filterLocation" name="filterLocation">
                                <option value="">All</option>
                            </select>
                            <label for="filterLocation">Location</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary btn-sm myBtn" id="clearPersonnelFilterBtn">CLEAR</button>
                    <button type="button" class="btn btn-outline-primary btn-sm myBtn" id="applyPersonnelFilterBtn">APPLY</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Are You Sure Personnel Modal -->
    <div id="areYouSurePersonnelModal" class="modal fade" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="areYouSurePersonnelModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content shadow">
                <div class="modal-header bg-primary bg-gradient text-white">
                    <h5 class="modal-title">Remove employee entry?</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure that you want to remove the entry for <span id="areYouSurePersonnelName" class="fw-bold"></span>?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary btn-sm myBtn" id="confirmDeletePersonnelBtn">YES</button>
                    <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">NO</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Can't Delete Department Modal -->
    <div id="cantDeleteDepartmentModal" class="modal fade" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="cantDeleteDepartmentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content shadow">
                <div class="modal-header bg-primary bg-gradient text-white">
                    <h5 class="modal-title">Cannot remove department ...</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    You cannot remove the entry for <span id="cantDeleteDeptName" class="fw-bold"></span> because it has <span id="personnelCount" class="fw-bold"></span> employees assigned to it.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Are You Sure Delete Department Modal -->
    <div id="areYouSureDeleteDepartmentModal" class="modal fade" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="areYouSureDeleteDepartmentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content shadow">
                <div class="modal-header bg-primary bg-gradient text-white">
                    <h5 class="modal-title">Remove department?</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="deleteDepartmentForm">
                        <input type="hidden" id="deleteDepartmentID">
                        <p>Are you sure that you want to remove the entry for <span id="areYouSureDeptName" class="fw-bold"></span>?</p>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" form="deleteDepartmentForm" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">YES</button>
                    <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">NO</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Are You Sure Delete Location Modal -->
    <div id="areYouSureDeleteLocationModal" class="modal fade" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="areYouSureDeleteLocationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content shadow">
                <div class="modal-header bg-primary bg-gradient text-white">
                    <h5 class="modal-title">Remove location?</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="deleteLocationForm">
                        <input type="hidden" id="deleteLocationID">
                        <p>Are you sure that you want to remove the entry for <span id="areYouSureLocationName" class="fw-bold"></span>?</p>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" form="deleteLocationForm" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">YES</button>
                    <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">NO</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Can't Delete Location Modal -->
    <div id="cantDeleteLocationModal" class="modal fade" tabindex="-1" data-bs-backdrop="false" data-bs-keyboard="false" aria-labelledby="cantDeleteLocationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content shadow">
                <div class="modal-header bg-primary bg-gradient text-white">
                    <h5 class="modal-title">Cannot remove location ...</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    You cannot remove the entry for <span id="cantDeleteLocationName" class="fw-bold"></span> because it has departments assigned to it.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary btn-sm myBtn" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.1/js/bootstrap.min.js'></script>
    <script src="./js/script.js?v=1.0.8"></script>

</body>

</html>