<!doctype html>
<html lang="en">

<head>
    <title>Company Directory</title>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <!-- Bootstrap CSS v5.3.2 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <!-- Custom CSS -->
    <link rel="stylesheet" href="./css/styles.css">
</head>

<body>
    <section>

        <div class="appHeader">
            <div class="row align-items-center">
                <div class="col-md-6 col-sm-12 mb-2 mb-md-0">
                    <input id="searchInp" class="form-control" placeholder="Search...">
                </div>
                <div class="col-md-6 col-sm-12 text-md-end">
                    <div class="btn-group" role="group" aria-label="buttons">
                        <button id="refreshBtn" type="button" class="btn" title="Refresh">
                            <i class="fa-solid fa-refresh fa-fw"></i>
                        </button>
                        <button id="filterBtn" type="button" class="btn" title="Filter Personnel">
                            <i class="fa-solid fa-filter fa-fw"></i>
                        </button>
                        <button id="addBtn" type="button" class="btn" title="Add New">
                            <i class="fa-solid fa-plus fa-fw"></i>
                        </button>
                    </div>
                </div>
            </div>
            <hr class="my-3 d-none d-md-block">
            <ul class="nav nav-tabs mt-md-0" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="personnelBtn" data-bs-toggle="tab" data-bs-target="#personnel-tab-pane" type="button" role="tab" aria-controls="personnel-tab-pane" aria-selected="true">
                        <i class="fa-solid fa-person fa-lg fa-fw"></i><span class="d-none d-sm-inline">Personnel</span>
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="departmentsBtn" data-bs-toggle="tab" data-bs-target="#departments-tab-pane" type="button" role="tab" aria-controls="departments-tab-pane" aria-selected="false">
                        <i class="fa-solid fa-building fa-lg fa-fw"></i><span class="d-none d-sm-inline">Departments</span>
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="locationsBtn" data-bs-toggle="tab" data-bs-target="#locations-tab-pane" type="button" role="tab" aria-controls="locations-tab-pane" aria-selected="false">
                        <i class="fa-solid fa-map-location-dot fa-lg fa-fw"></i><span class="d-none d-sm-inline">Locations</span>
                    </button>
                </li>
            </ul>
        </div>

        <div class="tab-content">
            <div class="tab-pane show active" id="personnel-tab-pane" role="tabpanel" aria-labelledby="personnel-tab" tabindex="0">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col" class="d-none d-md-table-cell">Department</th>
                                <th scope="col" class="d-none d-md-table-cell">Location</th>
                                <th scope="col" class="d-none d-md-table-cell">Email</th>
                                <th scope="col" class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="personnelTableBody"></tbody>
                    </table>
                </div>
            </div>
            <div class="tab-pane" id="departments-tab-pane" role="tabpanel" aria-labelledby="departments-tab" tabindex="0">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Department Name</th>
                                <th scope="col" class="d-none d-md-table-cell">Location</th>
                                <th scope="col" class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="departmentTableBody"></tbody>
                    </table>
                </div>
            </div>
            <div class="tab-pane" id="locations-tab-pane" role="tabpanel" aria-labelledby="locations-tab" tabindex="0">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Location Name</th>
                                <th scope="col" class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="locationTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <footer class="text-center">
            <p class="my-3">Company Directory &copy; 2025</p>
        </footer>
    </section>

    <!-- MODALS START HERE (Same as previous version, no changes needed in modals for this fix) -->
    <!-- Edit Personnel Modal -->
    <div id="editPersonnelModal" class="modal fade" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="editPersonnelModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title" id="editPersonnelModalLabel">Edit Employee</h5>
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
                            <input type="text" class="form-control" id="editPersonnelJobTitle" name="editPersonnelJobTitle" placeholder="Job title">
                            <label for="editPersonnelJobTitle">Job Title</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="editPersonnelEmailAddress" name="editPersonnelEmailAddress" placeholder="Email address" required>
                            <label for="editPersonnelEmailAddress">Email Address</label>
                        </div>
                        <div class="form-floating">
                            <select class="form-select" id="editPersonnelDepartment" name="editPersonnelDepartment" required>
                            </select>
                            <label for="editPersonnelDepartment">Department</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary myBtn" data-bs-dismiss="modal">CANCEL</button>
                    <button type="submit" form="editPersonnelForm" class="btn btn-primary myBtn">SAVE</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Personnel Modal -->
    <div class="modal fade" id="addPersonnelModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="addPersonnelModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <form id="addPersonnelForm">
                    <div class="modal-header bg-primary">
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
                        <button type="button" class="btn btn-secondary myBtn" data-bs-dismiss="modal">CANCEL</button>
                        <button type="submit" class="btn btn-primary myBtn">SAVE</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Add Department Modal -->
    <div class="modal fade" id="addDepartmentModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="addDepartmentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <form id="addDepartmentForm">
                    <div class="modal-header bg-primary">
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
                        <button type="button" class="btn btn-secondary myBtn" data-bs-dismiss="modal">CANCEL</button>
                        <button type="submit" class="btn btn-primary myBtn">SAVE</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Department Modal -->
    <div class="modal fade" id="editDepartmentModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="editDepartmentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <form id="editDepartmentForm">
                    <input type="hidden" id="editDepartmentID" name="id">
                    <div class="modal-header bg-primary">
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
                        <button type="button" class="btn btn-secondary myBtn" data-bs-dismiss="modal">CANCEL</button>
                        <button type="submit" class="btn btn-primary myBtn">SAVE</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Add Location Modal -->
    <div class="modal fade" id="addLocationModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="addLocationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <form id="addLocationForm">
                    <div class="modal-header bg-primary">
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
                        <button type="button" class="btn btn-secondary myBtn" data-bs-dismiss="modal">CANCEL</button>
                        <button type="submit" class="btn btn-primary myBtn">SAVE</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Location Modal -->
    <div class="modal fade" id="editLocationModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="editLocationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <form id="editLocationForm">
                    <input type="hidden" id="editLocationID" name="id">
                    <div class="modal-header bg-primary">
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
                        <button type="button" class="btn btn-secondary myBtn" data-bs-dismiss="modal">CANCEL</button>
                        <button type="submit" class="btn btn-primary myBtn">SAVE</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Filter Personnel Modal -->
    <div class="modal fade" id="filterPersonnelModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="filterPersonnelModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title" id="filterPersonnelModalLabel">Filter Personnel</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-floating mb-3">
                        <select class="form-select" id="filterDepartment" name="filterDepartment">
                            <option value="">Any Department</option>
                        </select>
                        <label for="filterDepartment">Filter by Department</label>
                    </div>
                    <div class="form-floating">
                        <select class="form-select" id="filterLocation" name="filterLocation">
                            <option value="">Any Location</option>
                        </select>
                        <label for="filterLocation">Filter by Location</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary myBtn" id="clearPersonnelFilterBtn">CLEAR</button>
                    <button type="button" class="btn btn-primary myBtn" id="applyPersonnelFilterBtn">APPLY</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Generic Delete Confirmation Modal -->
    <div class="modal fade" id="genericDeleteModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="genericDeleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-danger">
                    <h5 class="modal-title" id="genericDeleteModalLabel">Confirm Delete</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="delete-message">Are you sure you want to delete this item?</p>
                    <p class="text-danger dependency-message"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary myBtn" data-bs-dismiss="modal">CANCEL</button>
                    <button type="button" class="btn btn-danger myBtn" id="confirmDeleteBtn">DELETE</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JavaScript Libraries -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <!-- Custom Script -->
    <script src="./js/script.js?v=1.0.3"></script>
</body>

</html>