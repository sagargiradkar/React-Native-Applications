import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import i18n from "../Components/i18n";
import { useTranslation } from "react-i18next";
import TopNav from "../Components/TopNav";

export default function LanguageSelectionScreen() {
  const { t } = useTranslation(selectedLanguage);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const scan = () => {
    props.navigation.navigate("Scan");
  };
  const profile = () => {
    props.navigation.navigate("Profile");
  };

  const languages = ["English", "Hindi", "Gujarati", "Tamil", "Punjabi"];

  const handleLanguageChange = (language) => {
    let selectedLanguageCode;

    switch (language) {
      case "English":
        selectedLanguageCode = "English";
        break;
      case "Hindi":
        selectedLanguageCode = "Hindi";
        break;
      case "Gujarati":
        selectedLanguageCode = "Gujarati";
        break;
      case "Tamil":
        selectedLanguageCode = "Tamil";
        break;
      case "Punjabi":
        selectedLanguageCode = "Punjabi";
        break;
      // Add more cases for other languages here
      default:
        selectedLanguageCode = "English"; // Default to English
    }

    setSelectedLanguage(selectedLanguageCode);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    i18n.changeLanguage(selectedLanguage);
    // navigation.goBack();
  };
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#12114c",
        height: "100%",
      }}>
      {/* <TopNav onScan={scan} onProfile={profile} /> */}
      <View style={{ flex: 1, paddingTop: 20, margin: 5 }}>
        <Text style={{ color: "white" }}>
          {t("languageSelection.SelectLanguage")}
        </Text>
        <TouchableOpacity
          onPress={() => setIsDropdownOpen(true)}
          style={styles.dropdownButton}>
          <Text style={{ color: "white" }}>
            {selectedLanguage || "Select Language"}
          </Text>
        </TouchableOpacity>

        <Modal visible={isDropdownOpen} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
            <View style={styles.dropdownBackdrop}>
              <View style={styles.dropdownContent}>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Filter languages"
                  onChangeText={(text) => setFilterText(text)}
                  value={filterText}
                />
                {languages
                  .filter((language) =>
                    language.toLowerCase().includes(filterText.toLowerCase())
                  )
                  .map((language) => (
                    <TouchableOpacity
                      key={language}
                      onPress={() => handleLanguageChange(language)}
                      style={styles.dropdownItem}>
                      <View style={styles.dropdownItemTextWrapper}>
                        <Text style={styles.dropdownItemText}>{language}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity onPress={handleSave} style={styles.mainButton}>
          <Text style={{ color: "black", fontSize: 15, fontWeight: "bold" }}>
            {t("common.Save")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginVertical: 10,
  },
  dropdownBackdrop: {
    // flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // justifyContent: 'flex-end',
    marginVertical: 50,
  },
  dropdownContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 10,
    margin: 30,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownItemTextWrapper: {
    width: 80,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "black",
  },
  filterInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    marginBottom: 10,
  },
  mainButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#f6cb01",
    justifyContent: "center",
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 5,
  },
};
