<script setup>
import { ref, onMounted } from 'vue'
import Dynamsoft from "dwt";

defineProps({
  msg: String
})

const containerId = "dwtControlContainer"
const bWASM = ref(false);

onMounted(()=>{
  /**
   * ResourcesPath & ProductKey must be set in order to use the library!
   */
  Dynamsoft.DWT.ResourcesPath = "dwt-resources";
  Dynamsoft.DWT.ProductKey = 't00901wAAAKq7Er/GkEUjxv4/YYDCLuugMmOY/tdXVxFnWboQ8z1EEceCrbEcRDNqk+aTiBB/TFsfaIQgZGEzVUZ/4inSJ4b4B6lfbhAvX8AHyCsgehCRvAA+Ni2z';
  Dynamsoft.DWT.Containers = [{
    WebTwainId: "dwtObject",
    ContainerId: containerId,
    Width: "100%",
    Height: "400px",
  }, ];
  Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", () => {
      Dynamsoft_OnReady();
  });
  Dynamsoft.DWT.Load();
});

let DWObject;
let selectSources;
/**
 * Dynamsoft_OnReady is called when a WebTwain instance is ready to use.
 * In this callback we do some initialization.
 */
const Dynamsoft_OnReady = ()=>{
  DWObject = Dynamsoft.DWT.GetWebTwain(containerId);
  bWASM.value = Dynamsoft.Lib.env.bMobile || !Dynamsoft.DWT.UseLocalService;
  if (bWASM.value) {
    DWObject.Viewer.cursor = "pointer";
  } else {
    let sources = DWObject.GetSourceNames();
    selectSources = document.getElementById("sources");
    selectSources.options.length = 0;
    for (let i = 0; i < sources.length; i++) {
      selectSources.options.add(new Option(sources[i], i.toString()));
    }
  }
};
/**
 * Acquire images from scanners or cameras or local files
 */
const acquireImage = ()=>{
    if (!DWObject) DWObject = Dynamsoft.DWT.GetWebTwain();
    if (bWASM.value) {
      alert("Scanning is not supported under the WASM mode!");
    } else if (
      DWObject.SourceCount > 0 &&
      DWObject.SelectSourceByIndex(selectSources.selectedIndex)
    ) {
      const onAcquireImageSuccess = () => {
        DWObject.CloseSource();
      };
      const onAcquireImageFailure = onAcquireImageSuccess;
      DWObject.OpenSource();
      DWObject.AcquireImage({},
        onAcquireImageSuccess,
        onAcquireImageFailure
      );
    } else {
      alert("No Source Available!");
    }
};
/**
 * Open local images.
 */
const openImage = ()=>{
    if (!DWObject) DWObject = Dynamsoft.DWT.GetWebTwain();
    DWObject.IfShowFileDialog = true;
    /**
     * Note, this following line of code uses the PDF Rasterizer which is an extra add-on that is licensed seperately
     */
    DWObject.Addon.PDF.SetConvertMode(
        Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL
    );
    DWObject.LoadImageEx(
        "",
        Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL,
        () => {
            //success
        },
        () => {
            //failure
        }
    );
};
</script>

<template>
  <div class="hello">
      <h1>{{ msg }}</h1>
      <select v-if="!bWASM" id="sources"></select>
      <button v-if="!bWASM" @click="acquireImage()">Acquire Images</button>
      <button @click="openImage()">Open Documents</button>
      <br />
      <br />
      <!-- we use v-once to force vue don't update the component, which is controlled by native way. -->
      <div :id="containerId" v-once></div>
  </div>
</template>

<style scoped>
</style>
