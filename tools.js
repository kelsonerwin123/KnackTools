//creates a temporary password inside of a text field
const kn_tempPasswordGenerator = {
  create: (labelText) => {
    if (!labelText) labelText = "Temporary Password";

    const div = Knack.$(`.label.kn-label span:contains('${labelText}')`)
      .parent()
      .parent()
      .attr("id");
    const field = `#${div} .input`;

    const randchar = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 8);

    Knack.$(field).val(randchar);
    Knack.$(field).prop("disabled", true);
  },
};

const kn_isLoggedIn = function(){
  console.log('user logged in? %o', Knack.getUserAttributes() !== "No user found" ? true : false)
  return Knack.getUserAttributes() !== "No user found" ? true : false;
}

const kn_render = {
  //run on the render of any scene/view without checking if the user is logged in
  onRender: (type, keys, callback) =>{
    if (Array.isArray(keys)) {
      let viewObj = {};
      let numOfKeys = keys.length;
      let noCompleted = 0;

      keys.forEach((key) => {
        $(document).on(
          `knack-${type}-render.${type}_${key}`,
          function (event, view, data) {
            viewObj[view.key] = {
              event: event,
              [type]: view,
              data: data,
            }
            noCompleted++;
            if (numOfKeys === noCompleted) {
              typeof callback === "function" && callback(viewObj);
            }
          }
        );
      });
    } else {
      $(document).on(
        `knack-${type}-render.${type}_${keys}`,
        function (event, view, data) {
          typeof callback === "function" && callback({
            event: event, 
            [type]: view,
            data: data,
          });
        }
      );
    }
  },

  //only run code if user is logged in
  ifLoggedIn: (type, keys, callback) => {
    if (!kn_isLoggedIn()) return;
    kn_render.onRender(type, keys, callback)
  },
};



