import domController from "./domController";
import SaveDataService from "./saveDataService";

const stateService = new SaveDataService(localStorage);

const controller = new domController(stateService)
controller.addListeners()
