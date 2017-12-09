import { BaseService } from "../common/service/BaseService";
import { Link } from "./Link";
import { LinkDao } from "./LinkDao";

export class LinkService extends BaseService {
	private linkDao : LinkDao;
	
	constructor() {
		super();
		this.linkDao = new LinkDao();
	}

    /**
     * Get a link.
     * @param aLink
     *		The link to get
     * @param callback
     *		A callback function(err, result)
     */
	get(aLink:Link, callback:any) {
		var self = this;
		
		this.linkDao.read(aLink, function (err:any, response:Link) {
			if (err || !response) {
				callback(self._handleDAOError(err));
			}
			else {
				console.log(response);
				callback(undefined, response);
			}
		});
	}
	
	add(aLink:Link, callback:any) {
		var self = this;

		this.linkDao.read(aLink, function (err:any, response:Link) {
			aLink = response;

			if (aLink.getId() != undefined) {
				//le lien existe deja en bdd, il faut maj le compteur
				self.linkDao.update(aLink, function (err:any, response:any) {
					if (err || !response) {
						callback(self._handleDAOError(err));
					}
					else {
						console.log(response);
						callback(undefined, response);
					}
				});
			}
			else {
				self.linkDao.create(aLink, function (err:any, response:any) {
					if (err || !response) {
						callback(self._handleDAOError(err));
					}
					else {
						console.log(response);
						callback(undefined, response);
					}
				});
			}
		});
	}
	
}
