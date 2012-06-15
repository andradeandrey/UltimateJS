/**
 * Actor - is VisualEntity that can act on its own.
 * Actor can be described by:
 * - current state 
 * - set of actuators (effectors)
 * 
 * Actions can be assigned on one or several actuators. Actor manages that more prioritized
 * actions get access to actuators while terminating current actions if they executing.  
 */


Actor.prototype = new VisualEntity();
Actor.prototype.constructor = Actor;


/**
 * @constructor
 */
function Actor() {
	Actor.parent.constructor.call(this);
};

Actor.inheritsFrom(VisualEntity);
Actor.prototype.className = "Actor";

Actor.prototype.createInstance = function(params) {
	var entity = new Actor();
	entity.init(params);
	return entity;
};

entityFactory.addClass(Actor);

Actor.prototype.init = function(params) {
	Actor.parent.init.call(this, params);
};

Actor.prototype.createVisual = function() {
	var params = this.params;
	var visual = guiFactory.createObject("GuiSkeleton", {
		parent : this.guiParent,
		style : "sprite",
		x : params['x'],
		y : params['y'],
		width : params['width'],
		height : params['height']
	});

	var visualInfo = {};
	visualInfo.visual = visual;
	this.addVisual(null, visualInfo);
};

Actor.prototype.update = function(dt) {

	if(this.rootAction) {
		this.rootAction.update(dt);
	}
};


Actor.prototype.setAction = function(actionName,  params) {
	params.actor = this;
	var action = Action.factory.createObject(actionName, params);
	if(action) {
		if(this.rootAction) {
			this.rootAction.terminate(Action.INTERRUPTED);
		}
		this.rootAction = action;
	}
};

Actor.prototype.terminateAction = function(action, status) {
	this.rootAction = null;
	Account.instance.removeEntity(action.id);
}