export class BaseService {
    public _handleDAOError(err: string) : object {
        console.log("[BaseService] Error from DAO : " + JSON.stringify(err));

        return {
            message: "Error in the persistence unit."
        };
    }
}