var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var newRequestId = 0;

describe('all public website lookup interfaces', function() {
  describe('get all', function() {

    it('returns 200 when requesting all itirnaries', function(done) {
		chai.request('http://localhost:8080')
		  .get('/itineraries')
		  .send()
		  .then(function (res) {
		    expect(res).to.have.status(200);
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns an array when requesting all itirnaries', function(done) {
		chai.request('http://localhost:8080')
		  .get('/itineraries')
		  .send()
		  .then(function (res) {
		    expect(res.body).to.be.an("array");
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns 200 when requesting all purposes', function(done) {
		chai.request('http://localhost:8080')
		  .get('/purposes')
		  .send()
		  .then(function (res) {
		    expect(res).to.have.status(200);
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns an array when requesting all purposes', function(done) {
		chai.request('http://localhost:8080')
		  .get('/purposes')
		  .send()
		  .then(function (res) {
		    expect(res.body).to.be.an("array");
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns 200 when requesting all videos', function(done) {
		chai.request('http://localhost:8080')
		  .get('/public/videos')
		  .send()
		  .then(function (res) {
		    expect(res).to.have.status(200);
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns an array when requesting all videos', function(done) {
		chai.request('http://localhost:8080')
		  .get('/public/videos')
		  .send()
		  .then(function (res) {
		    expect(res.body).to.be.an("array");
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns 200 when requesting all interests', function(done) {
		chai.request('http://localhost:8080')
		  .get('/interests')
		  .send()
		  .then(function (res) {
		    expect(res).to.have.status(200);
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns an array when requesting all interests', function(done) {
		chai.request('http://localhost:8080')
		  .get('/interests')
		  .send()
		  .then(function (res) {
		    expect(res.body).to.be.an("array");
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns 200 when requesting all budgetcategories', function(done) {
		chai.request('http://localhost:8080')
		  .get('/budgetcategories')
		  .send()
		  .then(function (res) {
		    expect(res).to.have.status(200);
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns an array when requesting all budgetcategories', function(done) {
		chai.request('http://localhost:8080')
		  .get('/budgetcategories')
		  .send()
		  .then(function (res) {
		    expect(res.body).to.be.an("array");
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns 200 when requesting all referraltypes', function(done) {
		chai.request('http://localhost:8080')
		  .get('/referraltypes')
		  .send()
		  .then(function (res) {
		    expect(res).to.have.status(200);
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });

    it('returns an array when requesting all referraltypes', function(done) {
		chai.request('http://localhost:8080')
		  .get('/referraltypes')
		  .send()
		  .then(function (res) {
		    expect(res.body).to.be.an("array");
		    done();
		  })
		  .catch(function(err) {
		  	done(err);
		  });
    });
  
  }); // end function describe
}); // end module describe