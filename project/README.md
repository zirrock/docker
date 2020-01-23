Uruchomienie serwisu:
docker-compose up --scale dates=2

Strona serwisu:
http://localhost:8080

Możliwe operacje po zalogowaniu:
- stworzenie nowej grupy - panel po prawej
- stworzenie nowej daty - wciśnięcie własnej grupy, panel po prawej (powrót przez wciśnięcie nazwy serwisu)
- subskrypcja do grupy innego użytkownika - wpisanie danych do panelu po lewej, 
                                            fuzzy searh wyszukuje podobne grupy w bazie ES, 
                                            wciśnięcie klawisza subskrybuj 
                                            (nie dodałem klawisza wyloguj, należy przejść na link localhost:8080/loginPage)
                                            
operacje dodania daty, grupy i subskrypcja są asynchroniczne, mogą wymagać odświeżenia
