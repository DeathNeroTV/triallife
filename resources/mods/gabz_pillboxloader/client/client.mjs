import * as alt from 'alt-client';
import * as native from 'natives';

const activateInterior = (id, interiors) => {
  interiors.forEach((interior) => {
    if (!native.isInteriorEntitySetActive(id, interior.name)) {
      native.activateInteriorEntitySet(id, interior.name);
      if (interior.color) {
        native.setInteriorEntitySetColor(id, interior.name, interior.color);
      }
    }
  })
};


alt.onServer('LOADING PILLBOX', () => {
  alt.removeIpl('rc12b_destroyed');
  alt.removeIpl('rc12b_default');
  alt.removeIpl('rc12b_hospitalinterior_lod');
  alt.removeIpl('rc12b_hospitalinterior');
  alt.removeIpl('rc12b_fixed');


// Charge le pillbox de gabz
let gabzpillbox= native.getInteriorAtCoords(311.2546, -592.4204, 42.32737);
native.pinInteriorInMemory(gabzpillbox);
native.refreshInterior(gabzpillbox);


});

