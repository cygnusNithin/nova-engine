import { create } from "zustand";
import CameraModes from "../engine/camera/CameraModes";

const useEngineStore = create((set) => ({

    //-----------------------------------
    // Keyboard
    //-----------------------------------

    keyboard: {},

    setKeyboard: (keyboard) =>
        set({ keyboard }),

    //-----------------------------------
    // Mouse
    //-----------------------------------

    mouse: {

        x: 0,
        y: 0,

        deltaX: 0,
        deltaY: 0,

        left: false,
        middle: false,
        right: false,

        wheel: 0,

        locked: false,

    },

    setMouse: (mouse) =>
        set({ mouse }),

    consumeMouseMotion: () =>
        set((state) => ({
            mouse: {
                ...state.mouse,
                deltaX: 0,
                deltaY: 0,
                wheel: 0,
            },
        })),

    //-----------------------------------
    // Performance
    //-----------------------------------

    fps: 0,

    setFPS: (fps) =>
        set({ fps }),

    //-----------------------------------
    // Graphics
    //-----------------------------------

    quality: "High",

    setQuality: (quality) =>
        set({ quality }),

    //-----------------------------------
    // Editor
    //-----------------------------------

    editor: {

        enabled: true,

        mode: CameraModes.EDITOR,

        cameraSpeed: 0.15,

        mouseSensitivity: 0.002,

        showGrid: true,

        showAxes: true,

        selectedEntity: null,

        hoveredEntity: null,

        multiSelection: []

    },

    setEditor: (editor) =>
        set((state) => ({

            editor: {

                ...state.editor,

                ...editor

            }

        })),

    setSelectedEntity: (entity) =>
        set((state) => ({

            editor: {

                ...state.editor,

                selectedEntity: entity

            }

        })),

    setHoveredEntity: (entity) =>
        set((state) => ({

            editor: {

                ...state.editor,

                hoveredEntity: entity

            }

        })),

    clearSelection: () =>
        set((state) => ({

            editor: {

                ...state.editor,

                selectedEntity: null,

                hoveredEntity: null,

                multiSelection: []

            }

        })),

    //-----------------------------------
    // Entities
    //-----------------------------------

    entities: [],

    setEntities: (entities) =>
        set({

            entities

        }),

    addEntity: (entity) =>
        set((state) => ({

            entities: [

                ...state.entities,

                entity

            ]

        })),

    removeEntity: (entity) =>
        set((state) => ({

            entities: state.entities.filter(

                e => e !== entity

            )

        }))

}));

export default useEngineStore;
