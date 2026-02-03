import { createStyles } from "antd-style";

export const useProfileStyles = createStyles(({ token }) => ({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: token.marginLG,
  },
  layoutRow: {
    width: "100%",
  },
  photoCard: {
    height: "100%",
  },
  photoBox: {
    position: "relative",
    width: "100%",
    aspectRatio: "3 / 4",
    borderRadius: token.borderRadiusLG,
    overflow: "hidden",
    background: token.colorFillSecondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover .profile-photo-overlay": {
      opacity: 1,
    },
  },
  photoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  photoPlaceholder: {
    color: token.colorTextSecondary,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: token.marginXS,
  },
  photoOverlay: {
    position: "absolute",
    inset: 0,
    background: token.colorBgMask,
    opacity: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s ease",
  },
  photoActions: {
    display: "flex",
    gap: token.marginSM,
  },
  formCard: {
    height: "100%",
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: token.marginSM,
  },
  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  fieldValue: {
    padding: `${token.paddingXS}px 0`,
    display: "block",
  },
}));
