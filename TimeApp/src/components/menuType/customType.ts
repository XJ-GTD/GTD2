/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
import {MenuType, Animation} from "ionic-angular";

export class MenuScalePushType extends MenuType {
  constructor(menu, plt) {
    super(plt);
    let contentOpenedX, menuClosedX, menuOpenedX;
    const width = menu.width();
    if (menu.isRightSide) {
      // right side
      contentOpenedX = -width + 'px';
      menuClosedX = width + 'px';
      menuOpenedX = '0px';
    }
    else {
      contentOpenedX = width + 'px';
      menuOpenedX = '0px';
      menuClosedX = -width + 'px';
    }
    const menuAni = new Animation(plt, menu.getMenuElement());
    menuAni.fromTo('translateX', menuClosedX, menuOpenedX);
    this.ani.add(menuAni);
    const contentApi = new Animation(plt, menu.getContentElement());
    contentApi.fromTo('translateX', '0px', contentOpenedX);
    contentApi.fromTo('scale',1,.9);
    contentApi.fromTo('opacity',1,.5);
    this.ani.add(contentApi);
    const backdropAni = new Animation(plt, menu.getBackdropElement());
    backdropAni.fromTo('opacity',0,.2);
    this.ani.add(backdropAni);
  }
}

