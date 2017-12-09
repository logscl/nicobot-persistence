import { Link } from "./Link";
import { Response } from "../common/dto/Response";
import { LinkService } from "./LinkService";
import { ErrorItem } from "../common/model/Error";

export class LinkEndpoint {

	private static linkService: LinkService = new LinkService();

	public static index(req:any, res:any) {
		console.log("[LinkEndpoint] Incoming 'index' request : %j", req.query.link);

		var response = new Response();

		var link = new Link(req.query.link, 0);

		if (!link.validate()) {
			response.addErrors(link.getValidationErrors());
			res.json(response.toJSON());

			return;
		}

		LinkEndpoint.linkService.get(link, function(err:any, result:Link){
			if (err) {
				console.log("[LinkEndpoint] Errors : %j", err);
				response.addErrors(err);
			}
			else {
				response.setContent(LinkEndpoint.getLinkDto(result));
			}

			res.json(response);
		});
	}

	public static create(req:any, res:any) {
		console.log("[LinkEndpoint] Incoming 'create' request : %j", req.body.link);

		var linkBody = req.body.link;

		if (!linkBody) {
			res.statusCode = 204
			res.json();
			return;
		}

		var link = new Link(linkBody, 0);

		LinkEndpoint.linkService.add(link, function(err:any, result:Link){
			var response = new Response();

			if (err) {
				console.log("[LinkEndpoint] Errors : %j", err);
				response.addError(new ErrorItem("", err.message));
			}
			else {
				response.setContent(LinkEndpoint.getLinkDto(result));
			}

			res.json(response.toJSON());
		});
	}

	private static getLinkDto(link:Link) : Link {
		return link;
	}
}