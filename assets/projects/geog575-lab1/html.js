export function getToolUI() {
  return `
  <form class="p-1 bg-body rounded">
  <div class="form-group row">
      <label for="inputPassword" class="col-sm-3 col-form-label">Type</label>
      <div class="col-sm-9">
          <button id="house-type" type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown"
              aria-expanded="false">
              All Households
          </button>
          <ul class="dropdown-menu">
              <li class="dropdown-item active" id="all">All Housholds</li>
              <li class="dropdown-item" id="renters">Renters</li>
              <li class="dropdown-item" id="owners">Owners</li>
          </ul>
      </div>

  </div>
  <div class="form-group row">
      <label id="yearLabel" class="col-sm-3 col-form-label">Year</label>
      <div class="col-sm-9">
          <!-- <label id="yearLabel" for="yearRange" class="form-label"></label> -->
          <input type="range" class="form-range pl-10" min="2011" max="2019" step="1" value="2019" id="yearRange">
      </div>
  </div>
</form>
`
}