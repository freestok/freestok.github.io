export function getToolUI() {
    return `
    <div class="container-fluid mt-4">
    <div class="row justify-content-center">
      <div class="col-auto mb-3">
        <div class="card shadow" style="width: 18rem;">
          <div class="card-body">
            <!-- <h5 class="card-title">View housing burden in US Urbanized Areas</h5> -->
            <p>
              <button class="btn btn-primary my-auto" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
                aria-expanded="false" aria-controls="collapseExample">
                <i class="bi bi-info-circle-fill"></i>
              </button>
            </p>
            <div class="collapse" id="collapseExample">
              <div class="card-text">
                <a href="https://www.huduser.gov/portal/pdredge/pdr_edge_featd_article_092214.html">Per the U.S. census</a>, any household that pays more than 30% of their income on housing is considered to 
                be experiencing "housing burden". You can set this tool to explore housing burden by housing type (all households, owners, and renters) and by year.
              </div>
            </div>
            <form class="p-1 bg-body rounded float-right">
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
          </div>
        </div>
      </div>
    </div>
  </div>
    `
}