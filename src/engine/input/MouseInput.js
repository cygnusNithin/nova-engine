import useEngineStore from "../../store/engineStore";

export default function initializeMouseInput() {
  const { setMouse } = useEngineStore.getState();

  function update(changes) {
    const mouse = useEngineStore.getState().mouse;
    const nextChanges =
      typeof changes === "function" ? changes(mouse) : changes;

    setMouse({ ...mouse, ...nextChanges });
  }

  //------------------------------------------------------
  // Mouse Move
  //------------------------------------------------------

  const onMouseMove = (event) => {
    update((mouse) => ({
      x: event.clientX,
      y: event.clientY,
      deltaX: mouse.deltaX + event.movementX,
      deltaY: mouse.deltaY + event.movementY,
    }));

  };

  //------------------------------------------------------
  // Mouse Buttons
  //------------------------------------------------------

  const onMouseDown = (event) => {
    if (event.button === 0) update({ left: true });

    if (event.button === 1) update({ middle: true });

    if (event.button === 2) update({ right: true });
  };

  const onMouseUp = (event) => {
    if (event.button === 0) update({ left: false });

    if (event.button === 1) update({ middle: false });

    if (event.button === 2) update({ right: false });
  };

  //------------------------------------------------------
  // Mouse Wheel
  //------------------------------------------------------

  const onWheel = (event) => {
    update((mouse) => ({
      wheel: mouse.wheel + event.deltaY,
    }));

  };

  //------------------------------------------------------
  // Pointer Lock
  //------------------------------------------------------

  const onPointerLockChange = () => {
    update({
      locked: document.pointerLockElement !== null,
      // Prevent a movement jump after locking or unlocking.
      deltaX: 0,
      deltaY: 0,
    });
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("wheel", onWheel);
  document.addEventListener("pointerlockchange", onPointerLockChange);

  return () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("wheel", onWheel);
    document.removeEventListener("pointerlockchange", onPointerLockChange);
  };
}
