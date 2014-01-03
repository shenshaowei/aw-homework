// Generated by LiveScript 1.2.0
(function(){
  var Relation, replace$ = ''.replace;
  Relation = (function(){
    Relation.displayName = 'Relation';
    var prototype = Relation.prototype, constructor = Relation;
    Relation.registry = {};
    Relation.addRelation = function(namespace, start, relationDescription, end, type){
      var relation;
      relation = new Relation(namespace, start, relationDescription, end, type);
      this._addToRegistryOf(relation.startPoint.docName, relation);
      this._addToRegistryOf(relation.endPoint.docName, relation);
      console.log("Registry is: ", this.registry);
    };
    Relation._addToRegistryOf = function(docName, relation){
      var ref$;
      (ref$ = this.registry)[docName] || (ref$[docName] = []);
      this.registry[docName].push(relation);
    };
    Relation.getRelationsByDocName = function(docName){
      return this.registry[docName] || [];
    };
    function Relation(namespace, startPoint, relationDescription, endPoint, type){
      this.namespace = namespace;
      this.relationDescription = relationDescription;
      this.type = type || 'aggregation';
      this.getPoints(startPoint, endPoint);
      console.log("******** relation created is: ", JSON.stringify(this));
    }
    prototype.getPoints = function(startPoint, endPoint){
      var ref$, navigatingDirection;
      this.startPoint = this.getNames(startPoint);
      this.endPoint = this.getNames(endPoint);
      ref$ = this.relationDescription.split(/\s+/), this.startPoint.multiplicity = ref$[0], navigatingDirection = ref$[1], this.endPoint.multiplicity = ref$[2];
      return this.markAbilityOfCreateOtherSide();
    };
    prototype.getNames = function(point){
      if (typeof point === 'string') {
        return {
          docName: point,
          showName: point
        };
      } else {
        return point;
      }
    };
    prototype.markAbilityOfCreateOtherSide = function(){
      this.startPoint.canCreateOtherSide = true;
      if (this.type === 'composition') {
        this.endPoint.canCreateOtherSide = false;
      } else {
        this.endPoint.canCreateOtherSide = true;
      }
    };
    prototype.getGoCreateLink = function(currentEnd){
      return this.getLinkByAction('go-create', currentEnd);
    };
    prototype.getGoUpdateLink = function(currentEnd){
      return this.getLinkByAction('go-update', currentEnd);
    };
    prototype.getCurrentEnd = function(currentEnd){
      if (this.startPoint.docName === currentEnd) {
        return this.startPoint;
      } else {
        return this.endPoint;
      }
    };
    prototype.getOppositeEnd = function(currentEnd){
      if (this.startPoint.docName === currentEnd) {
        return this.endPoint;
      } else {
        return this.startPoint;
      }
    };
    prototype.getLinkByAction = function(action, currentEnd){
      var destinationEnd, face, docName, showName, fullDocName, view, link;
      destinationEnd = this.getOppositeEnd(currentEnd);
      face = this.stripGoPrefix(action);
      docName = destinationEnd.docName, showName = destinationEnd.showName;
      fullDocName = this.namespace + '.' + docName;
      view = face === 'list' ? 'list' : 'detail';
      link = {
        icon: action,
        path: action + '-' + fullDocName,
        to: [fullDocName, view, face].join('.'),
        citedDoc: docName,
        showName: showName,
        citedViewType: view,
        context: docName
      };
      this._alterLinkByFace(destinationEnd, link, face, docName, showName);
      console.log("action: " + action + ", current-end: " + currentEnd + ", link: ", link);
      return link;
    };
    prototype._alterLinkByFace = function(destinationEnd, link, face, docName, showName){
      switch (face) {
      case 'create':
        link.label = '创建' + showName;
        link.guard = destinationEnd.multiplicity === '1' ? "!" + docName + "._id" : true;
        delete link.context;
        break;
      case 'update':
        link.label = destinationEnd.multiplicity === '1'
          ? "更新" + showName
          : "更新{{bs '" + destinationEnd.showAttr + "'}}";
        link.guard = destinationEnd.multiplicity === '1'
          ? docName + ""
          : docName.pluralize() + "";
        break;
      case 'view':
        link.label = destinationEnd.multiplicity === '1'
          ? "更新" + showName
          : "更新{{bs '" + destinationEnd.showAttr + "'}}";
        if (view === 'detail') {
          link.guard = destinationEnd.multiplicity === '1'
            ? docName + ""
            : docName.pluralize() + "";
        } else {
          link.guard = 'true';
        }
        break;
      default:
        link.label = face + ': ' + showName;
        link.guard = 'true';
      }
      return link;
    };
    prototype.stripGoPrefix = function(action){
      var face;
      if (action.indexOf('go-') >= 0) {
        face = replace$.call(action, 'go-', '');
      } else {
        face = action;
      }
      if (action === 'go') {
        face = 'list';
      }
      return face;
    };
    prototype.getQuery = function(docName){
      var query;
      if (docName === this.startPoint.docName) {
        return query = "{" + docName + "Id: doc._id}";
      } else {
        return query = "{_id: doc." + this.startPoint.docName + "Id}";
      }
    };
    return Relation;
  }());
  if (typeof module != 'undefined' && module !== null) {
    module.exports = Relation;
  } else {
    BP.Relation = Relation;
  }
}).call(this);
